import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GLTFLoader, type GLTFParser, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMLoaderPlugin, VRM, VRMUtils } from '@pixiv/three-vrm'
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation'
import * as THREE from 'three'

interface ModelProps {
  fileUrl: string
  vrmaUrl?: string | undefined
}

function Model({ fileUrl, vrmaUrl }: ModelProps) {
  const vrmRef = useRef<VRM | null>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  const gltf = useLoader(GLTFLoader, fileUrl, (loader) => {
    loader.register((parser: GLTFParser) => {
      return new VRMLoaderPlugin(parser, { autoUpdateHumanBones: true })
    })
  })

  useEffect(() => {
    if (!gltf.userData.vrm) {
      return
    }

    const vrm: VRM = gltf.userData.vrm
    vrmRef.current = vrm
    VRMUtils.rotateVRM0(vrm)

    // Humanoidボーンマッピングを確認
    if (vrm.humanoid) {
      console.log('Humanoid bones:', vrm.humanoid.humanBones)

      // 各ボーンの実際の名前を出力
      Object.entries(vrm.humanoid.humanBones).forEach(([boneName, bone]) => {
        if (bone && bone.node) {
          console.log(`${boneName}: ${bone.node.name}`)
        }
      })
    }

    // シーン内の全ノードを確認
    console.log('=== All nodes in VRM scene ===')
    vrm.scene.traverse((node) => {
      if (node.type === 'Bone' || node.name.toLowerCase().includes('bone') || node.name.toLowerCase().includes('joint')) {
        console.log(`Node: ${node.name}, Type: ${node.type}`)
      }
    })

    const mixer = new THREE.AnimationMixer(vrm.scene)
    mixerRef.current = mixer

    let isMounted = true

    const loadAnimation = () => {
      if (vrmaUrl && vrm) {
        const animationLoader = new GLTFLoader()
        animationLoader.register((parser: GLTFParser) => {
          return new VRMAnimationLoaderPlugin(parser)
        })

        animationLoader.load(
          vrmaUrl,
          (gltf: GLTF) => {
            if (isMounted) {
              // 異なる可能性のあるプロパティ名を試す
              const animations = gltf.animations || gltf.userData?.animations || gltf.userData?.vrmAnimations

              if (animations && animations.length > 0) {
                // VRMAnimationとして処理
                if (gltf.userData?.vrmAnimations) {
                  const vrmAnimations = gltf.userData.vrmAnimations as any[]
                  if (vrmAnimations.length > 0) {
                    const vrmAnimation = vrmAnimations[0]
                    console.log('VRM Animation object:', vrmAnimation)

                    // createVRMAnimationClipを使用してクリップを作成
                    const clip = createVRMAnimationClip(vrmAnimation, vrm)

                    if (clip) {
                      const action = mixer.clipAction(clip)
                      action.setLoop(THREE.LoopRepeat, Infinity)
                      action.play()
                    } else {
                      console.warn('Failed to create animation clip')
                    }
                  }
                }
                // 通常のGLTFアニメーションとして処理（フォールバック）
                else if (gltf.animations && gltf.animations.length > 0) {
                  const clip = gltf.animations[0]
                  if (clip) {
                    console.log('Using fallback GLTF animation:', clip)
                    const action = mixer.clipAction(clip)
                    action.setLoop(THREE.LoopRepeat, Infinity)
                    action.play()
                  }
                }
              } else {
                console.warn('No animations found in loaded VRMA file')
              }
            }
          },
          (progress) => {
            console.log('Loading progress:', progress)
          },
          (error: unknown) => {
            console.error('Error loading VRMA:', error)
          }
        )
      }
    }

    loadAnimation()

    return () => {
      isMounted = false
      mixer.stopAllAction()
      mixer.uncacheRoot(vrm.scene)
    }
  }, [gltf, vrmaUrl])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
    vrmRef.current?.update(delta)
  })

  return <primitive object={gltf.scene} position={[0, -1, 0]} />
}

interface R3FCanvasProps {
  fileUrl: string
  vrmaUrl?: string | undefined
}

export default function R3FCanvas({ fileUrl, vrmaUrl }: R3FCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.8, 3], fov: 30 }}
      style={{ height: '500px', width: '100%' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        castShadow
        position={[3, 3, 3]}
        intensity={2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <Suspense fallback={null}>
        <Model fileUrl={fileUrl} vrmaUrl={vrmaUrl} />
      </Suspense>
      <OrbitControls target={[0, 0, 0]} />
    </Canvas>
  )
}
