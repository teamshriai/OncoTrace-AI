import { useEffect, useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* ──────────────────────────────────────────────
   Shared scroll store  (mutated directly so the
   Three.js render-loop reads it without causing
   React re-renders)
   ────────────────────────────────────────────── */
const scrollStore = { progress: 0 }

/* ── Animated counter ── */
function Counter({ target, suffix, start }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!start) return
    let raf
    const dur = 1800
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target])

  return (
    <>
      {val}
      {suffix}
    </>
  )
}

/* ── 3-D DNA helix ── */
function DNAModel() {
  const { scene } = useGLTF('/DNA_STRAND_NEW.glb')
  const groupRef = useRef()

  const pivot = useMemo(() => {
    const clone = scene.clone()

    const box    = new THREE.Box3().setFromObject(clone)
    const size   = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const s = 9 / Math.max(size.x, size.y, size.z)

    /* centre the clone at the local origin */
    clone.position.set(-center.x, -center.y, -center.z)

    /* wrapper handles scale + orientation */
    const wrapper = new THREE.Group()
    wrapper.add(clone)
    wrapper.scale.setScalar(s)
    wrapper.rotation.set(0, 0, Math.PI / 2)

    clone.traverse((n) => {
      if (n.isMesh) {
        n.castShadow    = true
        n.receiveShadow = true

        if (n.material) {
          n.material = n.material.clone()
          n.material.envMapIntensity = 0
          n.material.roughness       = 0.45
          n.material.metalness       = 0.5
          n.material.flatShading     = false
          n.material.dithering       = false
          n.material.needsUpdate     = true
        }
      }
    })

    return wrapper
  }, [scene])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y =
      clock.elapsedTime * 0.35 + scrollStore.progress * Math.PI * 6
  })

  return (
    <group ref={groupRef}>
      <primitive object={pivot} />
    </group>
  )
}

/* ── Loading spinner inside canvas ── */
function Loader() {
  const ref = useRef()
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d
      ref.current.rotation.y += d * 1.3
    }
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#38bdf8" wireframe />
    </mesh>
  )
}



/* ── Story panels (horizontal scroll-driven text) ── */
const STORY_PANELS = [
  {
    tag: '01 — Discovery',
    title: 'Mapping the\nGenome',
    body: 'Advanced AI algorithms decode millions of genetic sequences to identify critical biomarkers for early disease detection.',
  },
  {
    tag: '02 — Detection',
    title: 'Early Cancer\nDetection',
    body: 'Our platform screens for 47+ cancer types from simple blood tests, achieving 99% sensitivity in clinical trials.',
  },
  {
    tag: '03 — Precision',
    title: 'Personalized\nMedicine',
    body: 'Tailored therapeutic strategies driven by each patient\'s unique genomic profile, maximizing treatment efficacy.',
  },
  {
    tag: '04 — Scale',
    title: 'Global Health\nImpact',
    body: 'Transforming cancer care for 30M+ users across 60 countries, with $100M in capital fueling our mission.',
  },
  {
    tag: '05 — Future',
    title: 'Redefining\nOncology',
    body: 'Pioneering the next generation of diagnostic intelligence — where no cancer goes undetected.',
  },
]

/* ══════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════ */
export default function DNA3DSection() {
  const sectionRef   = useRef()
  const textTrackRef = useRef()
  const headingRef   = useRef()
  const statsRef     = useRef()
  const scrollHintRef = useRef()
  const [started, setStarted] = useState(false)

  /* ── counter trigger ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  /* ── scroll → store + DOM animations (no React re-renders) ── */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return

      const r         = sectionRef.current.getBoundingClientRect()
      const scrollable = r.height - window.innerHeight
      if (scrollable <= 0) return

      const scrolled  = Math.max(0, -r.top)
      const progress  = Math.max(0, Math.min(1, scrolled / scrollable))

      /* shared store for Three.js render-loop */
      scrollStore.progress = progress

      /* ── horizontal text track ── */
      if (textTrackRef.current) {
        const trackW = textTrackRef.current.scrollWidth
        const vw     = window.innerWidth
        const x = -trackW + progress * (trackW + vw)
        textTrackRef.current.style.transform =
          `translate3d(${x}px, 0, 0)`
      }

      /* ── heading: fade out in the first 20% of scroll ── */
      if (headingRef.current) {
        headingRef.current.style.opacity = String(
          Math.max(0, 1 - progress * 5),
        )
      }

      /* ── scroll-hint: fade out quickly ── */
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(
          Math.max(0, 1 - progress * 8),
        )
      }

      /* ── stats: fade in during the last 20% ── */
      if (statsRef.current) {
        statsRef.current.style.opacity = String(
          Math.max(0, Math.min(1, (progress - 0.78) / 0.18)),
        )
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '400vh' }}
    >
      {/* ─────────── sticky viewport ─────────── */}
      <div
        className="sticky top-0 h-screen overflow-hidden
                   bg-gradient-to-b from-slate-950 via-[#0b1120] to-slate-950"
      >
        {/* ── ambient glow (z-0) ── */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[700px] h-[700px] rounded-full bg-blue-600/[.07] blur-[140px]"
          />
          <div
            className="absolute top-[30%] left-[28%]
                       w-[350px] h-[350px] rounded-full bg-violet-500/[.06] blur-[110px]"
          />
          <div
            className="absolute bottom-[20%] right-[22%]
                       w-[280px] h-[280px] rounded-full bg-cyan-400/[.05] blur-[100px]"
          />
        </div>

        {/* ── heading (fades on scroll) ── */}
        <div
          ref={headingRef}
          className="absolute top-12 inset-x-0 z-30 text-center px-6
                     transition-opacity duration-100"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold
                       text-white tracking-tight leading-tight"
          >
            Realtime{' '}
            <span
              className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300
                         bg-clip-text text-transparent"
            >
              Precision
            </span>{' '}
            Monitoring
          </h2>
          <p className="mt-4 mb-22 text-sm md:text-base text-blue-200/40 max-w-xl mx-auto">
            Harnessing AI           </p>
        </div>

        {/* ── scroll hint ── */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 inset-x-0 z-30 flex flex-col
                     items-center gap-2 pointer-events-none select-none"
        >
          <span className="text-[11px] tracking-[0.25em] uppercase text-blue-300/30 font-semibold">
            Scroll to explore
          </span>
          <span className="block w-5 h-8 rounded-full border border-blue-400/20 relative">
            <span
              className="absolute left-1/2 top-1.5 -translate-x-1/2
                         w-1 h-1.5 rounded-full bg-blue-400/60
                         animate-bounce"
            />
          </span>
        </div>

        {/* ──────────────────────────────────────
            STORYTELLING TEXT TRACK
            ─ sits BEHIND the DNA canvas (z-[5])
            ────────────────────────────────────── */}
        <div
          className="absolute inset-0 z-[5] flex items-center
                     overflow-hidden pointer-events-none select-none"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div
            ref={textTrackRef}
            className="flex items-center will-change-transform"
            style={{
              gap: 'clamp(6rem, 12vw, 12rem)',
              transform: 'translate3d(-100%, 0, 0)',
            }}
          >
            {STORY_PANELS.map((panel, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-6"
                style={{ width: 'clamp(320px, 38vw, 580px)' }}
              >
                {/* tag */}
                <span
                  className="block text-[10px] md:text-xs font-bold
                             tracking-[0.3em] uppercase text-blue-400/60
                             mb-3"
                >
                  {panel.tag}
                </span>

                {/* large background title */}
                <h3
                  className="text-5xl md:text-6xl lg:text-[5.5rem]
                             font-black text-white/[.18] leading-[1.05]
                             whitespace-pre-line"
                >
                  {panel.title}
                </h3>

                {/* accent bar */}
                <span
                  className="block w-10 h-[2px] rounded-full
                             bg-gradient-to-r from-blue-400/40 to-cyan-400/25
                             mt-5 mb-4"
                />

                {/* body */}
                <p
                  className="text-sm md:text-[15px] text-blue-100/[.35]
                             leading-relaxed max-w-[340px]"
                >
                  {panel.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ──────────────────────────────────────
            3-D CANVAS  –  ABOVE text (z-10)
            ────────────────────────────────────── */}
        <div
          className="absolute inset-0 z-10 flex items-center
                     justify-center pointer-events-none"
        >
          <div className="w-full max-w-2xl aspect-[3/4] max-h-[78vh]">
            <Canvas
              camera={{ position: [0, 0, 12], fov: 40 }}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.NoToneMapping,
              }}
            >
              <Suspense fallback={<Loader />}>
                <ambientLight intensity={0.9} />

                <directionalLight
                  position={[5, 8, 5]}
                  intensity={1.6}
                  color="#ffffff"
                />
                <directionalLight
                  position={[-4, -3, 6]}
                  intensity={0.6}
                  color="#38bdf8"
                />

                <pointLight position={[-6, 4, 4]}  intensity={0.8} color="#38bdf8" />
                <pointLight position={[6, -4, -3]}  intensity={0.6} color="#818cf8" />
                <pointLight position={[0, -8, 2]}   intensity={0.4} color="#22d3ee" />
                <pointLight position={[0, 8, -2]}   intensity={0.4} color="#e2e8f0" />

                <DNAModel />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  )
}

useGLTF.preload('/DNA_STRAND.glb')