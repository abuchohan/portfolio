import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Activity } from '../App';
import VoxelCat from './VoxelCat';

type Vec3 = [number, number, number];
type SceneProps = { activity: Activity; paused: boolean; reducedMotion: boolean };
const palette = { wood: '#bc8961', woodLight: '#d7ac7d', trim: '#a17450', dark: '#344641', skin: '#b47d57', hair: '#332d29' };

function Block({ at = [0, 0, 0], size = [1, 1, 1], color, rotation, emissive }: { at?: Vec3; size?: Vec3; color: string; rotation?: Vec3; emissive?: string }) {
  return <mesh position={at} rotation={rotation} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={.86} emissive={emissive} emissiveIntensity={emissive ? .3 : 0} /></mesh>;
}

function Cylinder({ at, radius, height, color, segments = 12 }: { at: Vec3; radius: number; height: number; color: string; segments?: number }) {
  return <mesh position={at} castShadow receiveShadow><cylinderGeometry args={[radius, radius * .9, height, segments]} /><meshStandardMaterial color={color} roughness={.8} /></mesh>;
}

function Plant({ at, scale = 1, pot = '#ba7960' }: { at: Vec3; scale?: number; pot?: string }) {
  return <group position={at} scale={scale}>
    <Cylinder at={[0, .17, 0]} radius={.19} height={.3} color={pot} segments={8} />
    <Cylinder at={[0, .32, 0]} radius={.2} height={.065} color={pot} segments={8} />
    <Cylinder at={[0, .355, 0]} radius={.16} height={.012} color="#64533c" segments={8} />
    <Block at={[0, .56, 0]} size={[.055, .47, .055]} color="#5b7450" />
    {Array.from({ length: 7 }, (_, i) => <group key={i} rotation={[0, i * 2.4, 0]} position={[0, .48 + i * .06, 0]}><Block at={[.12, .04, 0]} size={[.3, .09, .14]} rotation={[0, 0, .5 + i * .04]} color={i % 2 ? '#8aab72' : '#688957'} /></group>)}
  </group>;
}

function RoomShell() {
  return <group>
    <Block at={[0, -.16, 0]} size={[6.6, .3, 4.8]} color="#b8ad91" />
    <Block at={[0, -.025, 0]} size={[6.55, .07, 4.75]} color="#d4bb91" />
    {Array.from({ length: 12 }, (_, row) => Array.from({ length: 5 }, (_, col) => <Block key={`${row}-${col}`} at={[-2.62 + col * 1.31, .015, -2.17 + row * .39]} size={[1.27, .025, .375]} color={['#d9c39e', '#dfcaa7', '#d4bd98', '#e2cdab'][(col + row * 3) % 4]} />))}
    <Block at={[-3.25, 1.44, -.13]} size={[.12, 2.9, 4.5]} color="#e0e2cd" />
    <Block at={[0, 1.44, -2.34]} size={[6.6, 2.9, .14]} color="#eeeedd" />
    <Block at={[-3.16, .12, -.13]} size={[.06, .24, 4.4]} color="#c5c7ad" />
    <Block at={[0, .12, -2.24]} size={[6.4, .24, .06]} color="#d2d3bb" />
    <Block at={[-3.25, 2.91, -.13]} size={[.16, .08, 4.5]} color="#f3f1e2" />
    <Block at={[0, 2.91, -2.34]} size={[6.6, .08, .18]} color="#f7f5e9" />
    {/* Sunlit four-pane window. */}
    <Block at={[-1.5, 1.99, -2.24]} size={[1.55, 1.4, .12]} color="#b2b89b" />
    <Block at={[-1.5, 1.99, -2.16]} size={[1.39, 1.24, .055]} color="#c9e0d6" emissive="#d4eadb" />
    <Block at={[-1.5, 1.99, -2.1]} size={[.055, 1.26, .055]} color="#fff9e6" />
    <Block at={[-1.5, 1.99, -2.1]} size={[1.4, .055, .055]} color="#fff9e6" />
    <Block at={[-1.5, 1.27, -2.09]} size={[1.78, .12, .36]} color="#f8f2de" />
    <Plant at={[-1.95, 1.34, -2.08]} scale={.45} />
    <Block at={[-3.16, 1.94, -.42]} size={[.07, .79, .63]} color={palette.wood} />
    <Block at={[-3.11, 1.94, -.42]} size={[.025, .66, .5]} color="#f8f0d8" />
    <Block at={[-3.09, 1.89, -.42]} size={[.015, .29, .28]} color="#8e9e76" />
    <Block at={[-3.085, 2.07, -.53]} size={[.018, .11, .11]} color="#d8a465" />
    <Block at={[.1, .04, .94]} size={[3.85, .035, 1.95]} color="#c3c4a2" />
    <Block at={[.1, .062, .94]} size={[3.55, .015, 1.65]} color="#d6d4b4" />
    {[-1, 0, 1].map(n => <Block key={n} at={[n * .95 + .1, .074, .94]} size={[.025, .01, 1.56]} color="#b0b591" />)}
    {Array.from({ length: 16 }, (_, i) => <group key={i}><Block at={[-1.7 + i * .24, .048, 1.96]} size={[.065, .02, .13]} color="#c3c4a2" /><Block at={[-1.7 + i * .24, .048, -.08]} size={[.065, .02, .13]} color="#c3c4a2" /></group>)}
  </group>;
}

function Desk() {
  return <group position={[-1.65, 0, -.95]}>
    <Block at={[0, 1.03, 0]} size={[2.35, .14, 1.02]} color={palette.woodLight} />
    <Block at={[0, .94, 0]} size={[2.22, .09, .88]} color={palette.wood} />
    {[-.99, .99].map(x => [-.34, .34].map(z => <Block key={`${x}-${z}`} at={[x, .48, z]} size={[.1, .96, .1]} color={palette.trim} />))}
    <Block at={[.72, .71, 0]} size={[.6, .39, .84]} color={palette.wood} />
    <Block at={[.72, .72, .43]} size={[.51, .025, .035]} color="#d6ad7d" />
    <Block at={[.72, .79, .46]} size={[.16, .035, .035]} color="#665d46" />
    <Block at={[-.2, 1.13, -.16]} size={[.44, .055, .26]} color={palette.dark} />
    <Block at={[-.2, 1.31, -.25]} size={[.075, .36, .075]} color={palette.dark} />
    <Block at={[-.2, 1.65, -.25]} size={[1.04, .69, .095]} color="#35423d" />
    <Block at={[-.2, 1.66, -.195]} size={[.92, .56, .02]} color="#263b36" emissive="#3d6352" />
    <Block at={[-.2, 1.9, -.181]} size={[.92, .045, .015]} color="#4d6355" />
    {Array.from({ length: 7 }, (_, i) => <group key={i}><Block at={[-.57, 1.82 - i * .057, -.178]} size={[.023, .014, .01]} color="#6d8d7a" /><Block at={[-.37 + (i % 3) * .04, 1.82 - i * .057, -.178]} size={[.19 + (i % 3) * .08, .019, .01]} color={i % 3 === 0 ? '#d7b47d' : '#9cbd9b'} /><Block at={[-.04 + (i % 2) * .04, 1.82 - i * .057, -.178]} size={[.15 + (i % 2) * .09, .019, .01]} color="#7c9c9c" /></group>)}
    <Block at={[-.2, 1.125, .28]} size={[.78, .045, .26]} color="#e6dfc8" />
    {Array.from({ length: 3 }, (_, row) => Array.from({ length: 10 }, (_, col) => <Block key={`${row}-${col}`} at={[-.53 + col * .073, 1.152, .2 + row * .073]} size={[.047, .009, .04]} color="#b6bba8" />))}
    <Block at={[.4, 1.125, .31]} size={[.12, .06, .18]} color="#d5d6c1" />
    <Cylinder at={[-.94, 1.23, .22]} radius={.095} height={.23} color="#f2e9d6" />
    <Cylinder at={[-.94, 1.35, .22]} radius={.073} height={.006} color="#61503a" />
    <Block at={[-.82, 1.24, .22]} size={[.075, .1, .06]} color="#eee3cb" />
    <Plant at={[.84, 1.11, -.22]} scale={.48} pot="#a7ad8e" />
    <Block at={[0, .54, 1.17]} size={[.67, .13, .65]} color="#829477" />
    <Block at={[0, .9, 1.47]} size={[.65, .67, .1]} color="#829477" />
    <Block at={[0, .25, 1.17]} size={[.09, .5, .09]} color="#586650" />
    <Block at={[0, .1, 1.17]} size={[.7, .06, .09]} color="#586650" />
    <Block at={[0, .1, 1.17]} size={[.09, .06, .63]} color="#586650" />
  </group>;
}

function Kitchen({ activity }: { activity: Activity }) {
  return <group position={[1.8, 0, -1.25]}>
    <Block at={[0, .54, 0]} size={[2.25, 1.04, 1.1]} color="#87967a" />
    <Block at={[0, .12, .01]} size={[2.12, .2, 1.04]} color="#65755d" />
    <Block at={[0, 1.1, 0]} size={[2.37, .14, 1.18]} color="#e6deca" />
    {[-.75, .76].map(x => <group key={x}><Block at={[x, .63, .562]} size={[.62, .76, .04]} color="#95a287" /><Block at={[x + (x > 0 ? -.16 : .16), .82, .59]} size={[.055, .16, .04]} color="#dbd5b9" /></group>)}
    <Block at={[0, .59, .566]} size={[.73, .78, .05]} color="#e1dfcd" />
    <Block at={[0, .52, .6]} size={[.59, .45, .035]} color="#39483e" />
    <Block at={[0, .52, .624]} size={[.45, .3, .015]} color="#4a5547" />
    <Block at={[0, .8, .63]} size={[.52, .045, .06]} color="#777c68" />
    {[-.23, -.08, .08, .23].map(x => <Cylinder key={x} at={[x, .935, .6]} radius={.034} height={.045} color="#6b7363" />)}
    <Block at={[0, 1.18, 0]} size={[.88, .035, .91]} color="#444f42" />
    {[-.22, .22].map(x => [-.23, .23].map(z => <group key={`${x}-${z}`}><Cylinder at={[x, 1.208, z]} radius={.14} height={.017} color="#252e29" /><Cylinder at={[x, 1.22, z]} radius={.098} height={.012} color={activity === 'cooking' && x > 0 && z > 0 ? '#d99652' : '#697164'} /></group>))}
    <Cylinder at={[.22, 1.34, .23]} radius={.19} height={.22} color="#bf7857" />
    <Cylinder at={[.22, 1.456, .23]} radius={.19} height={.018} color="#e2ba7b" />
    <Cylinder at={[.22, 1.467, .23]} radius={.155} height={.009} color="#a37b44" />
    <Block at={[.49, 1.35, .23]} size={[.22, .065, .07]} color="#5d5443" />
    <Block at={[-.04, 1.35, .23]} size={[.13, .065, .07]} color="#5d5443" />
    <Block at={[.77, 1.197, .14]} size={[.49, .045, .53]} color={palette.woodLight} />
    <Block at={[.72, 1.24, .13]} size={[.22, .045, .065]} color="#e9a16a" rotation={[0, .4, 0]} />
    <Block at={[.89, 1.25, .25]} size={[.09, .08, .1]} color="#70914c" />
    <Cylinder at={[-.8, 1.32, -.17]} radius={.12} height={.28} color="#cfbd8e" />
    {[-.06, .04].map((x, i) => <Block key={x} at={[-.8 + x, 1.58, -.17]} size={[.035, .38, .035]} rotation={[0, 0, i ? -.15 : .14]} color="#816c49" />)}
    {Array.from({ length: 3 }, (_, row) => Array.from({ length: 8 }, (_, col) => <Block key={`${row}-${col}`} at={[-1.05 + col * .3, 1.35 + row * .22, -.99]} size={[.287, .208, .025]} color={(row + col) % 3 === 0 ? '#e2e5d4' : '#f6f2e3'} />))}
    <Block at={[.02, 2.17, -.83]} size={[2.5, .12, .46]} color={palette.woodLight} />
    <Block at={[-.9, 2.04, -.89]} size={[.05, .25, .29]} color={palette.trim} />
    <Block at={[.9, 2.04, -.89]} size={[.05, .25, .29]} color={palette.trim} />
    {[-.86, -.53, -.2].map((x, i) => <group key={x}><Cylinder at={[x, 2.4, -.86]} radius={.105} height={.33 - i * .04} color={['#c49c6e', '#b9c29c', '#d9caa4'][i]} /><Cylinder at={[x, 2.58 - i * .02, -.86]} radius={.11} height={.055} color="#9e7e55" /></group>)}
    <Block at={[.35, 2.34, -.84]} size={[.14, .28, .25]} color="#c07f61" rotation={[0, 0, -.15]} />
    <Block at={[.53, 2.37, -.84]} size={[.12, .31, .25]} color="#a7b28a" />
    <Plant at={[.95, 2.24, -.84]} scale={.46} pot="#ddd2b8" />
  </group>;
}

function Avatar({ activity, paused, reducedMotion }: SceneProps) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!body.current) return;
    const targetX = activity === 'coding' ? -1.65 : 1.9;
    const targetZ = activity === 'coding' ? -.15 : -.32;
    if (!paused && !reducedMotion) time.current += Math.min(delta, .05);
    const t = time.current;
    const distance = Math.abs(body.current.position.x - targetX) + Math.abs(body.current.position.z - targetZ);
    const instant = paused || reducedMotion;
    const walking = distance > .04 && !instant;
    const mix = instant ? 1 : 1 - Math.exp(-delta * 3);
    body.current.position.x = THREE.MathUtils.lerp(body.current.position.x, targetX, mix);
    body.current.position.z = THREE.MathUtils.lerp(body.current.position.z, targetZ, mix);
    const sitting = activity === 'coding' && !walking;
    body.current.position.y = sitting ? -.04 : 0;
    const animated = !paused && !reducedMotion;
    body.current.position.y += animated ? Math.sin(t * (walking ? 15 : 2.5)) * (walking ? .035 : .008) : 0;
    const facing = walking ? (targetX > body.current.position.x ? Math.PI / 2 : -Math.PI / 2) : Math.PI;
    let angle = facing - body.current.rotation.y;
    angle = Math.atan2(Math.sin(angle), Math.cos(angle));
    body.current.rotation.y += angle * mix;
    if (head.current) head.current.rotation.y = walking ? 0 : -.7 + (animated ? Math.sin(t * .55) * .13 : 0);
    if (leftArm.current && rightArm.current) {
      leftArm.current.rotation.x = walking ? (animated ? Math.sin(t * 12) * .55 : 0) : -1.6 + (animated ? Math.sin(t * (sitting ? 12 : 3)) * .06 : 0);
      rightArm.current.rotation.x = walking ? -leftArm.current.rotation.x : (sitting ? -1.6 : -1.9) + (animated ? Math.cos(t * (sitting ? 13 : 3)) * .08 : 0);
      rightArm.current.rotation.z = !walking && !sitting && animated ? Math.sin(t * 3) * .2 : 0;
    }
    if (leftLeg.current && rightLeg.current) {
      leftLeg.current.rotation.x = sitting ? -Math.PI / 2.8 : animated && walking ? Math.sin(t * 12) * .65 : 0;
      rightLeg.current.rotation.x = sitting ? -Math.PI / 2.8 : -leftLeg.current.rotation.x;
    }
  });
  return <group ref={body} position={[-1.65, 0, -.15]} rotation={[0, Math.PI, 0]}>
    <group ref={leftLeg} position={[-.13, .58, 0]}><Block at={[0, -.23, 0]} size={[.21, .45, .24]} color="#424c46" /><Block at={[0, -.47, .055]} size={[.24, .13, .36]} color="#f2e8cf" /><Block at={[0, -.53, .055]} size={[.25, .035, .37]} color="#b6ad95" /></group>
    <group ref={rightLeg} position={[.13, .58, 0]}><Block at={[0, -.23, 0]} size={[.21, .45, .24]} color="#424c46" /><Block at={[0, -.47, .055]} size={[.24, .13, .36]} color="#f2e8cf" /><Block at={[0, -.53, .055]} size={[.25, .035, .37]} color="#b6ad95" /></group>
    <Block at={[0, .87, 0]} size={[.55, .63, .32]} color="#7b8f68" />
    <Block at={[0, .88, .169]} size={[.17, .54, .018]} color="#eee4cb" />
    <Block at={[-.16, 1.01, .175]} size={[.13, .12, .02]} color="#657b58" />
    {activity === 'cooking' && <><Block at={[0, .79, .19]} size={[.42, .44, .025]} color="#e6d9bd" /><Block at={[0, 1.03, .19]} size={[.26, .22, .025]} color="#e6d9bd" /><Block at={[0, .75, .21]} size={[.23, .13, .015]} color="#d0c3a5" /></>}
    <group ref={leftArm} position={[-.36, 1.1, 0]}><Block at={[0, -.15, 0]} size={[.19, .35, .26]} color="#7b8f68" /><Block at={[0, -.38, .01]} size={[.16, .18, .18]} color={palette.skin} /></group>
    <group ref={rightArm} position={[.36, 1.1, 0]}><Block at={[0, -.15, 0]} size={[.19, .35, .26]} color="#7b8f68" /><Block at={[0, -.38, .01]} size={[.16, .18, .18]} color={palette.skin} />{activity === 'cooking' && <Block at={[0, -.63, .04]} size={[.045, .52, .045]} color="#936e46" />}</group>
    <Block at={[0, 1.22, 0]} size={[.2, .15, .22]} color={palette.skin} />
    <group ref={head} position={[0, 1.5, 0]}>
      <Block size={[.56, .53, .48]} color={palette.skin} />
      <Block at={[0, .27, -.02]} size={[.6, .2, .52]} color={palette.hair} />
      <Block at={[0, .08, -.24]} size={[.58, .36, .1]} color={palette.hair} />
      {[-.22, -.07, .09, .24].map((x, i) => <Block key={x} at={[x, .34 + (i % 2) * .025, -.025]} size={[.17, .14, .5]} color={i % 2 ? '#3d322b' : palette.hair} />)}
      <Block at={[-.27, .11, .05]} size={[.08, .23, .23]} color={palette.hair} />
      <Block at={[.27, .11, .05]} size={[.08, .23, .23]} color={palette.hair} />
      <Block at={[-.29, -.02, .02]} size={[.09, .14, .13]} color={palette.skin} />
      <Block at={[.29, -.02, .02]} size={[.09, .14, .13]} color={palette.skin} />
      {[-.13, .13].map(x => <group key={x}><Block at={[x, .035, .245]} size={[.065, .065, .017]} color="#292b27" /><Block at={[x, .105, .247]} size={[.095, .035, .018]} color={palette.hair} /></group>)}
      <Block at={[0, -.05, .27]} size={[.09, .09, .09]} color="#c28a60" />
      <Block at={[0, -.18, .225]} size={[.4, .14, .075]} color={palette.hair} />
      <Block at={[0, -.13, .269]} size={[.13, .025, .014]} color="#d5a481" />
    </group>
  </group>;
}

function Steam({ activity, paused, reducedMotion }: SceneProps) {
  const steam = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!steam.current || paused || reducedMotion) return;
    time.current += Math.min(delta, .05);
    steam.current.children.forEach((particle, i) => {
      const phase = (time.current * .38 + i / 6) % 1;
      particle.position.set(Math.sin(phase * 6 + i) * .12, phase * .8, Math.cos(phase * 5 + i) * .07);
      particle.scale.setScalar(.5 + phase * 1.2);
      ((particle as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = Math.sin(phase * Math.PI) * .45;
    });
  });
  return <group ref={steam} visible={activity === 'cooking'} position={[2.02, 1.55, -1.02]}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, i * .12, 0]}><boxGeometry args={[.09, .09, .09]} /><meshStandardMaterial color="#fffdf0" transparent opacity={.35} depthWrite={false} /></mesh>)}</group>;
}

function Camera() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const orthographic = camera as THREE.OrthographicCamera;
    orthographic.zoom = Math.min(size.width / 10, size.height / 7.3);
    orthographic.updateProjectionMatrix();
    camera.lookAt(0, 1.05, 0);
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function Scene(props: SceneProps) {
  return <>
    <Camera />
    <ambientLight intensity={1.65} color="#fff8e8" />
    <directionalLight position={[-3, 8, 5]} intensity={3} color="#fff3d9" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-normalBias={.04} shadow-bias={-.0001} />
    <directionalLight position={[5, 4, -3]} intensity={.7} color="#e2eadb" />
    <group position={[0, -.1, 0]}>
      <RoomShell /><Desk /><Kitchen activity={props.activity} /><Avatar {...props} /><Steam {...props} />
      <VoxelCat paused={props.paused} reducedMotion={props.reducedMotion} />
      <Plant at={[-2.67, .04, 1.48]} scale={1.3} pot="#c48968" />
      <group position={[2.7, 0, 1.32]}><Block at={[0, .24, 0]} size={[.49, .46, .49]} color="#c9b58d" /><Block at={[0, .49, 0]} size={[.52, .05, .52]} color="#dfcaa1" /><Plant at={[0, .52, 0]} scale={.6} pot="#eee1c7" /></group>
      <Block at={[-2.6, .22, -1.91]} size={[.26, .42, .31]} color="#899477" /><Block at={[-2.3, .18, -1.91]} size={[.21, .34, .31]} color="#c39370" />
    </group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.3, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={.12} /></mesh>
  </>;
}

export default function CookRoom(props: SceneProps) {
  return <Canvas orthographic frameloop={props.paused || props.reducedMotion ? 'demand' : 'always'} camera={{ position: [9, 7.4, 10], near: .1, far: 100, zoom: 60 }} shadows dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<div className="scene-fallback">A little code. A little cooking. Something good is on the way.</div>} onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1; }}><Scene {...props} /></Canvas>;
}
