'use client'

import { AdaptiveDpr, Bvh, Preload, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile } from 'react-device-detect'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import { extend, useThree } from '@react-three/fiber'
import { useEffect, useState, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

extend(THREE as any)

// DRACOローダーの設定を削除し、コンポーネント内で行う

function Model({ modelPath }) {
	const [model, setModel] = useState(null)

	// GLTFローダーとDRACOローダーを手動で設定
	useEffect(() => {
		if (!modelPath) return

		// DRACOローダーの設定部分
		const dracoLoader = new DRACOLoader()
		// Google公式CDNを使用
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
		// JavaScriptデコーダーを使用（WASMではなく）
		dracoLoader.setDecoderConfig({ type: 'js' })

		const gltfLoader = new GLTFLoader()
		gltfLoader.setDRACOLoader(dracoLoader)

		gltfLoader.load(
			modelPath,
			(gltf) => {
				// console.log('モデルがロードされました:', gltf)

				// トゥーンシェーディングを適用
				gltf.scene.traverse((child) => {
					if (child instanceof THREE.Mesh && child.material) {
						try {
							// 元のマテリアルのプロパティを保存
							const originalMaterial = child.material
							let color = new THREE.Color(0xffffff)
							let map = null

							// 元のマテリアルから色とテクスチャを取得
							if (originalMaterial.color) {
								color = originalMaterial.color
							}

							if (originalMaterial.map) {
								map = originalMaterial.map
							}

							// 新しいトゥーンマテリアルを作成
							const toonMaterial = new THREE.MeshToonMaterial({
								color: color,
								map: map
							})

							// マテリアルを置き換え
							child.material = toonMaterial

							console.log('マテリアルを変換しました:', child.name)
						} catch (error) {
							console.error('マテリアル変換エラー:', error)
						}
					}
				})

				setModel(gltf.scene)
			},
			// (progress) => {
			// 	console.log('ロード進捗:', (progress.loaded / progress.total) * 100, '%')
			// },
			// (error) => {
			// 	console.error('モデルロードエラー:', error)
			// }
		)

		return () => {
			// クリーンアップ
			if (model) {
				model.traverse((object) => {
					if (object.geometry) object.geometry.dispose()
					if (object.material) {
						if (object.material.map) object.material.map.dispose()
						object.material.dispose()
					}
				})
			}
		}
	}, [modelPath])

	// モデルがロードされるまでnullを返す
	if (!model) return null

	return <primitive object={model} />
}

// ライトのセットアップコンポーネント
function Lights() {
	return (
		<>
			<ambientLight intensity={0.5} />
			<directionalLight
				position={[5, 5, 5]}
				intensity={1.5}
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
			/>
			<directionalLight position={[-5, 3, -5]} intensity={0.8} />
		</>
	)
}

// 基本のpropsを定義（window参照を条件付きに）
const defaultCanvasProps = {
	gl: {
		antialias: true,
		depth: true,
		stencil: false
	},
	camera: {
		near: 0.01,
		far: 100,
		fov: 75,
		zoom: isMobile ? 0.75 : 1,
		position: new Vector3(0, 0, 5)
	},
	dpr: typeof window !== 'undefined' ? window.devicePixelRatio : 1
}

export default function Scene({ modelPath }) {
	const [boxHover] = useState(false)
	const [contentElement, setContentElement] = useState(null)

	// デバッグ用：propsが正しく渡されているか確認
	// useEffect(() => {
	// 	console.log('モデルパス:', modelPath)
	// }, [modelPath])

	useEffect(() => {
		// クライアントサイドでのみ実行
		const body = document.getElementsByTagName('body')[0]
		if (boxHover) {
			body.style.cursor = 'pointer'
		} else {
			body.style.cursor = 'default'
		}

		// contentエレメントを取得
		const content = document.getElementById('content')
		setContentElement(content)
	}, [boxHover])

	return (
		<Canvas
			id='canvas'
			dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
			{...defaultCanvasProps}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				zIndex: 1,
				overflow: 'hidden'
			}}
			eventSource={contentElement}
			onCreated={(state) => {
				state.gl.toneMapping = THREE.ACESFilmicToneMapping
				state.gl.shadowMap.enabled = true
				state.gl.shadowMap.type = THREE.PCFSoftShadowMap
			}}
			eventPrefix='client'
			flat
		>
			<color attach='background' args={['#7d7d7d']} />
			<Bvh>
				<AdaptiveDpr />
				<Preload all />
				<OrbitControls />
				<Lights />
				{modelPath ? (
					<Model modelPath={modelPath} />
				) : (
					<mesh>
						<boxGeometry args={[1, 1, 1]} />
						<meshStandardMaterial color='hotpink' />
					</mesh>
				)}
			</Bvh>
			<Preload all />
		</Canvas>
	)
}
