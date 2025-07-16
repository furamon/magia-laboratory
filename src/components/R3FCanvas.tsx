import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'
import { NoToneMapping, type Group } from 'three'

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

  // モデルの全てのメッシュで影を有効にする
  useEffect(() => {
    scene.traverse((child) => {
      if ('isMesh' in child && child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
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
      <ambientLight intensity={1} />
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
