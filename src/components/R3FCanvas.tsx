import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'
import { NoToneMapping, MeshToonMaterial, type Group, type Mesh, type Material } from 'three'

interface ModelProps {
  fileUrl: string
  animationName?: string | null
}

function Model({ fileUrl, animationName }: ModelProps) {
  const group = useRef<Group>(null!)
  // publicディレクトリからのパスでGLBファイルを読み込む
  const { scene, animations } = useGLTF(fileUrl)
  const { actions } = useAnimations(animations, group)

  // アニメーションの再生制御
  useEffect(() => {
    // すべてのアニメーションを停止
    Object.values(actions).forEach((action) => action.stop())

    // 指定された名前のアニメーションがあれば再生
    if (animationName && actions[animationName]) {
      actions[animationName]?.reset().play()
    }
  }, [animationName, actions])

  // モデルの全てのメッシュで影を有効にし、MeshToonMaterialを適用
  useEffect(() => {
    scene.traverse((child) => {
      if ('isMesh' in child && child.isMesh) {
        const mesh = child as Mesh

        // 影の設定
        mesh.castShadow = true
        mesh.receiveShadow = true

        // 既存のマテリアルを取得
        const originalMaterial = mesh.material as Material

        // MeshToonMaterialを作成し、既存のテクスチャを引き継ぐ
        if (originalMaterial) {
          const toonMaterial = new MeshToonMaterial()

          // 既存マテリアルのプロパティを可能な限り引き継ぐ
          if ('map' in originalMaterial && originalMaterial.map) {
            toonMaterial.map = originalMaterial.map
          }
          if ('normalMap' in originalMaterial && originalMaterial.normalMap) {
            toonMaterial.normalMap = originalMaterial.normalMap
          }
          if ('roughnessMap' in originalMaterial && originalMaterial.roughnessMap) {
            toonMaterial.roughnessMap = originalMaterial.roughnessMap
          }
          if ('metalnessMap' in originalMaterial && originalMaterial.metalnessMap) {
            toonMaterial.metalnessMap = originalMaterial.metalnessMap
          }
          if ('aoMap' in originalMaterial && originalMaterial.aoMap) {
            toonMaterial.aoMap = originalMaterial.aoMap
          }
          if ('emissiveMap' in originalMaterial && originalMaterial.emissiveMap) {
            toonMaterial.emissiveMap = originalMaterial.emissiveMap
          }
          if ('color' in originalMaterial && originalMaterial.color) {
            toonMaterial.color.copy(originalMaterial.color)
          }
          if ('emissive' in originalMaterial && originalMaterial.emissive) {
            toonMaterial.emissive.copy(originalMaterial.emissive)
          }
          if ('transparent' in originalMaterial) {
            toonMaterial.transparent = originalMaterial.transparent
          }
          if ('opacity' in originalMaterial) {
            toonMaterial.opacity = originalMaterial.opacity
          }

          // 新しいマテリアルを適用
          mesh.material = toonMaterial

          // 元のマテリアルを破棄
          if (originalMaterial.dispose) {
            originalMaterial.dispose()
          }
        }
      }
    })
  }, [scene])

  return <primitive ref={group} object={scene} position={[0, -1, 0]} />
}

interface R3FCanvasProps {
  fileUrl: string
  animationName?: string | null
}

export default function R3FCanvas({
  fileUrl,
  animationName = null,
}: R3FCanvasProps) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, toneMapping: NoToneMapping }}
      camera={{ position: [0, 0, 3], fov: 30 }}
      style={{ height: '500px', width: '100%' }}
    >
      {/* 環境光 */}
      <ambientLight intensity={1.5} />
      {/* 平行光 */}
      <directionalLight
        castShadow
        position={[5, 5, 5]}
        intensity={2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={null}>
        <Model fileUrl={fileUrl} animationName={animationName} />
      </Suspense>
      {/* カメラコントロール */}
      <OrbitControls />
    </Canvas>
  )
}
