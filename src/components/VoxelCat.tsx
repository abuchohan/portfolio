import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Vec3 = [number, number, number];
const fur = { cream: '#eee6d5', light: '#faf2e1', shade: '#d7cdbc', point: '#82776f', mask: '#746963', stripe: '#5c5551', nose: '#e59859' };

function Fluff({ at, size, color = fur.cream, rotation }: { at: Vec3; size: Vec3; color?: string; rotation?: Vec3 }) {
  return <mesh position={at} rotation={rotation} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={.95} /></mesh>;
}

function SleepLetter() {
  return <>
    <Fluff at={[0, .055, 0]} size={[.12, .025, .025]} color="#8d9d80" />
    {[-1, 0, 1].map(step => <Fluff key={step} at={[step * .035, step * .028, 0]} size={[.035, .035, .025]} color="#8d9d80" />)}
    <Fluff at={[0, -.055, 0]} size={[.12, .025, .025]} color="#8d9d80" />
  </>;
}

export default function VoxelCat({ paused, reducedMotion }: { paused: boolean; reducedMotion: boolean }) {
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const ear = useRef<THREE.Group>(null);
  const openEyes = useRef<THREE.Group>(null);
  const closedEyes = useRef<THREE.Group>(null);
  const dreams = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (paused || reducedMotion) return;
    time.current += Math.min(delta, .05);
    const t = time.current;
    // A brief sleepy peek, then back to his nap. All motion follows the room's pause control.
    const peeking = t % 24 > 18 && t % 24 < 21;
    if (torso.current) torso.current.scale.y = 1 + Math.sin(t * 1.7) * .025;
    if (head.current) head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, peeking ? -.12 : .1, 3, delta);
    if (tail.current) tail.current.rotation.y = Math.sin(t * .65) * .065;
    if (ear.current) ear.current.rotation.z = Math.pow(Math.max(0, Math.sin(t * .8)), 16) * .12;
    if (openEyes.current) openEyes.current.visible = peeking && Math.sin(t * 2.5) > -.95;
    if (closedEyes.current) closedEyes.current.visible = !openEyes.current?.visible;
    if (dreams.current) {
      dreams.current.visible = !peeking;
      dreams.current.children.forEach((letter, i) => {
        const phase = (t * .18 + i * .5) % 1;
        letter.position.set(-.34 + phase * .14, .74 + phase * .36, .2);
        letter.scale.setScalar(.55 + Math.sin(phase * Math.PI) * .3);
      });
    }
  });

  return <group name="sleeping-neva-masquerade" position={[.66, .085, 1.13]} rotation={[0, .36, 0]}>
    {/* Stepped layers give him a broad, fluffy Siberian silhouette. */}
    <group ref={torso} position={[.08, .12, -.07]}>
      <Fluff at={[0, .14, 0]} size={[.83, .38, .55]} />
      <Fluff at={[.05, .32, -.015]} size={[.61, .13, .43]} color={fur.light} />
      <Fluff at={[.12, .11, -.28]} size={[.55, .2, .12]} color={fur.shade} />
      <Fluff at={[-.3, .12, .05]} size={[.27, .29, .49]} color={fur.light} />
      {[[-.3, .08, .28], [-.03, .1, .3], [.25, .09, .28]].map((at, i) => <Fluff key={i} at={at as Vec3} size={[.22, .16, .12]} color={i % 2 ? fur.light : fur.cream} />)}
    </group>
    {/* Tucked paws and a little white ruff beneath the mask. */}
    <Fluff at={[-.35, .09, .34]} size={[.23, .14, .25]} color={fur.point} />
    <Fluff at={[-.08, .09, .39]} size={[.21, .14, .25]} color={fur.point} />
    {[-.39, -.31, -.12, -.045].map(x => <Fluff key={x} at={[x, .105, .475]} size={[.017, .055, .014]} color={fur.stripe} />)}
    <Fluff at={[-.28, .27, .17]} size={[.49, .32, .36]} color={fur.light} />
    <Fluff at={[-.49, .25, .18]} size={[.13, .2, .25]} />
    <Fluff at={[-.06, .24, .19]} size={[.13, .2, .25]} />
    <group ref={head} position={[-.29, .39, .25]} rotation={[.1, 0, 0]}>
      <Fluff at={[0, 0, 0]} size={[.44, .37, .36]} />
      <Fluff at={[0, -.015, .17]} size={[.36, .27, .075]} color={fur.mask} />
      <Fluff at={[-.18, -.04, .14]} size={[.1, .2, .13]} color={fur.point} />
      <Fluff at={[.18, -.04, .14]} size={[.1, .2, .13]} color={fur.point} />
      <Fluff at={[0, .115, .18]} size={[.105, .09, .07]} color={fur.point} />
      {[-.15, .15].map((x, i) => <group key={x} ref={i === 1 ? ear : undefined} position={[x, .19, -.015]} rotation={[0, 0, x > 0 ? -.12 : .12]}>
        <Fluff at={[0, .045, 0]} size={[.14, .2, .14]} color={fur.point} />
        <Fluff at={[0, .16, -.01]} size={[.075, .09, .09]} color={fur.point} />
        <Fluff at={[0, .05, .075]} size={[.075, .12, .016]} color="#c8a394" />
        <Fluff at={[0, .21, -.01]} size={[.028, .055, .035]} color={fur.cream} />
      </group>)}
      <group ref={openEyes} visible={false}>
        {[-.105, .105].map(x => <group key={x} position={[x, .025, .214]}>
          <Fluff at={[0, 0, 0]} size={[.085, .065, .018]} color="#9ed8e7" />
          <Fluff at={[0, 0, .012]} size={[.025, .055, .01]} color="#354f65" />
          <Fluff at={[-.018, .018, .018]} size={[.018, .018, .008]} color="#fff9ed" />
        </group>)}
      </group>
      <group ref={closedEyes}>
        {[-.105, .105].map(x => <Fluff key={x} at={[x, .012, .228]} size={[.085, .024, .016]} color={fur.stripe} rotation={[0, 0, x > 0 ? -.12 : .12]} />)}
      </group>
      <Fluff at={[-.055, -.085, .225]} size={[.11, .09, .08]} color={fur.light} />
      <Fluff at={[.055, -.085, .225]} size={[.11, .09, .08]} color={fur.light} />
      <Fluff at={[0, -.046, .275]} size={[.075, .05, .045]} color={fur.nose} />
      <Fluff at={[0, -.105, .273]} size={[.018, .035, .012]} color={fur.point} />
      {[-1, 1].map(side => <group key={side}>
        <Fluff at={[side * .19, -.06, .255]} size={[.16, .012, .013]} color={fur.light} rotation={[0, 0, side * .15]} />
        <Fluff at={[side * .19, -.105, .255]} size={[.16, .012, .013]} color={fur.light} rotation={[0, 0, -side * .12]} />
      </group>)}
    </group>
    {/* A bushy, ringed tail curled around his side. */}
    <group ref={tail} position={[.43, .13, -.08]}>
      <Fluff at={[.055, .025, .12]} size={[.24, .24, .43]} color={fur.point} rotation={[0, -.25, 0]} />
      <Fluff at={[-.035, .015, .36]} size={[.29, .22, .25]} color={fur.point} rotation={[0, -.65, 0]} />
      <Fluff at={[-.23, .005, .46]} size={[.35, .2, .19]} color={fur.point} />
      <Fluff at={[.07, .035, .04]} size={[.245, .245, .065]} color={fur.stripe} rotation={[0, -.25, 0]} />
      <Fluff at={[.025, .025, .23]} size={[.245, .245, .065]} color={fur.stripe} rotation={[0, -.25, 0]} />
      <Fluff at={[-.16, .015, .45]} size={[.06, .21, .2]} color={fur.stripe} />
      <Fluff at={[-.38, 0, .46]} size={[.13, .18, .18]} color={fur.stripe} />
    </group>
    <group ref={dreams} rotation={[0, .35, 0]}>
      <group position={[-.34, .8, .2]} scale={.7}><SleepLetter /></group>
      <group position={[-.26, 1, .2]} scale={.55}><SleepLetter /></group>
    </group>
  </group>;
}
