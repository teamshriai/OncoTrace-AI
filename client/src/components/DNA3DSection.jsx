import { useEffect, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Scroll store — lerped for silky-smooth motion
   ───────────────────────────────────────────── */
const scrollStore = { target: 0, current: 0 };

/* ── Panel data ── */
const PANELS = [
  {
    tag: "01 — Liquid Biopsy",
    title: "Non-Invasive\nMonitoring",
    body: "Leveraging Liquid Biopsy as a non-invasive method to capture real-time biological signals, enabling continuous cancer tracking without repeated invasive procedures.",
  },
  {
    tag: "02 — AI Core",
    title: "Intelligent\nAnalysis",
    body: "Artificial Intelligence analyzes complex biological data, identifies patterns, and generates meaningful insights for precision monitoring in oncology.",
  },
  {
    tag: "03 — Real-Time",
    title: "Precision\nTracking",
    body: "Real-time precision monitoring of cancer progression, helping clinicians and patients understand how the disease evolves over time.",
  },
  {
    tag: "04 — Open Source",
    title: "Global\nCollaboration",
    body: "Built as an open-source, not-for-profit platform, ensuring accessibility, transparency, and collaborative innovation across the global oncology ecosystem.",
  },
  {
    tag: "05 — Impact",
    title: "Empowering\nDecisions",
    body: "Empowering better decision-making through reliable, data-driven insights for clinicians, researchers, patients, and pharmaceutical companies.",
  },
];

const LERP_FACTOR = 0.065;

/* ── 3-D DNA Model — sized to fill ~70% of screen height ── */
function DNAModel() {
  const { scene } = useGLTF("/DNA_STRAND_NEW.glb");
  const groupRef = useRef();

  const pivot = useMemo(() => {
    const clone = scene.clone();
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const s = 13.5 / Math.max(size.x, size.y, size.z);

    clone.position.set(-center.x, -center.y, -center.z);

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(s);
    wrapper.rotation.set(0, 0, Math.PI / 2);

    clone.traverse((n) => {
      if (n.isMesh && n.material) {
        n.material = n.material.clone();
        n.material.color = new THREE.Color("#60a5fa");
        n.material.envMapIntensity = 0.3;
        n.material.roughness = 0.25;
        n.material.metalness = 0.75;
        n.material.needsUpdate = true;
      }
    });

    return wrapper;
  }, [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      clock.elapsedTime * 0.25 + scrollStore.current * Math.PI * 4;
  });

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      <primitive object={pivot} />
    </group>
  );
}

/* ── Loader spinner ── */
function Loader() {
  const ref = useRef();
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d;
      ref.current.rotation.y += d * 1.3;
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#60a5fa" wireframe />
    </mesh>
  );
}

/* ═════════════════════════════════════════════
   MAIN EXPORT
   ═════════════════════════════════════════════ */
export default function DNA3DSection() {
  const sectionRef = useRef();
  const headingRef = useRef();
  const scrollHintRef = useRef();
  const textTrackRef = useRef();

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      const scrollable = r.height - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = Math.max(0, -r.top);
      scrollStore.target = Math.max(0, Math.min(1, scrolled / scrollable));
    };

    let raf;
    const animate = () => {
      const diff = scrollStore.target - scrollStore.current;
      if (Math.abs(diff) > 0.00001) {
        scrollStore.current += diff * LERP_FACTOR;
      } else {
        scrollStore.current = scrollStore.target;
      }

      const progress = scrollStore.current;

      if (headingRef.current) {
        headingRef.current.style.opacity = String(
          Math.max(0, 1 - progress * 5)
        );
      }

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(
          Math.max(0, 1 - progress * 8)
        );
      }

      if (textTrackRef.current) {
        const trackW = textTrackRef.current.scrollWidth;
        const vw = window.innerWidth;
        const x = vw - progress * (vw + trackW);
        textTrackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[600vh]">
      {/* ─── sticky viewport ─── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-white">

        {/* ── ambient glows ── */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[700px] w-[700px]
                       -translate-x-1/2 -translate-y-1/2
                       rounded-full bg-blue-100/50 blur-[160px]"
          />
          <div
            className="absolute left-[28%] top-[30%]
                       h-[350px] w-[350px]
                       rounded-full bg-blue-200/30 blur-[120px]"
          />
          <div
            className="absolute bottom-[20%] right-[22%]
                       h-[280px] w-[280px]
                       rounded-full bg-cyan-100/25 blur-[100px]"
          />
        </div>

        {/* ══════════════════════════════════════
            HEADING
            ══════════════════════════════════════ */}
        <div
          ref={headingRef}
          className="absolute inset-x-0 top-0 z-30 px-4 pt-3
                     text-center sm:pt-4 lg:pt-5"
        >
          <p
            className="text-[10px] font-semibold uppercase
                       tracking-[0.35em] text-blue-400/80
                       sm:text-[11px]"
          >
            Liquid Biopsy meets Artificial Intelligence
          </p>
          <h2
            className="mt-1.5 text-2xl font-bold tracking-tight
                       text-slate-900
                       sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Real-Time{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-cyan-500
                         bg-clip-text text-transparent"
            >
              Precision
            </span>{" "}
            Monitoring
          </h2>
          <p
            className="mx-auto mt-1 max-w-md text-xs text-slate-400
                       sm:mt-2 sm:text-sm"
          >
            Transforming cancer care through Liquid Biopsy and AI — enabling
            continuous, real-time precision monitoring of cancer progression
          </p>
        </div>

        {/* ── scroll hint ── */}
        <div
          ref={scrollHintRef}
          className="pointer-events-none absolute inset-x-0 bottom-4
                     z-30 flex select-none flex-col items-center gap-1.5
                     sm:bottom-6 sm:gap-2"
        >
          <span
            className="text-[9px] font-medium uppercase
                       tracking-[0.3em] text-slate-300 sm:text-[10px]"
          >
            Scroll
          </span>
          <svg
            width="14"
            height="22"
            viewBox="0 0 16 24"
            fill="none"
            className="text-slate-300"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="8"
              cy="7"
              r="1.5"
              fill="currentColor"
              className="animate-bounce"
            />
          </svg>
        </div>

        {/* ══════════════════════════════════════
            TEXT TRACK — z-[5] (behind canvas)
            ══════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]
                     flex select-none items-center overflow-hidden
                     pt-[4vh]
                     [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]
                     [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]"
        >
          <div
            ref={textTrackRef}
            className="flex items-center gap-[clamp(3rem,8vw,12rem)]
                       will-change-transform"
          >
            {PANELS.map((panel, i) => (
              <div
                key={i}
                className="w-[clamp(260px,80vw,580px)] flex-shrink-0
                           px-4 sm:px-6"
              >
                <span
                  className="mb-2 block text-[9px] font-bold uppercase
                             tracking-[0.3em] text-blue-600/70
                             sm:mb-3 sm:text-[10px] md:text-xs"
                >
                  {panel.tag}
                </span>
                <h3
                  className="whitespace-pre-line text-4xl font-black
                             leading-[1.05] text-blue-400/50
                             sm:text-5xl md:text-6xl lg:text-[5.5rem]"
                >
                  {panel.title}
                </h3>
                <span
                  className="mb-3 mt-3 block h-[2px] w-8 rounded-full
                             bg-gradient-to-r from-blue-500/60 to-cyan-400/40
                             sm:mb-4 sm:mt-5 sm:w-10"
                />
                <p
                  className="max-w-[300px] text-xs leading-relaxed
                             text-slate-500
                             sm:max-w-[340px] sm:text-sm md:text-[15px]"
                >
                  {panel.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            3-D CANVAS — z-[10] (above text track)
            ══════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-0 z-[10]
                     flex items-center justify-center"
        >
          <div className="relative h-full w-full">
            <Canvas
              camera={{ position: [0, 0, 20], fov: 50 }}
              dpr={[1, 2]}
              className="!bg-transparent"
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                toneMapping: THREE.NoToneMapping,
              }}
            >
              <Suspense fallback={<Loader />}>
                <ambientLight intensity={1.1} />

                <directionalLight
                  position={[5, 8, 5]}
                  intensity={2.4}
                  color="#ffffff"
                />
                <directionalLight
                  position={[-4, -3, 6]}
                  intensity={1.0}
                  color="#93c5fd"
                />

                <pointLight
                  position={[-6, 4, 4]}
                  intensity={0.8}
                  color="#60a5fa"
                />
                <pointLight
                  position={[6, -4, -3]}
                  intensity={0.5}
                  color="#818cf8"
                />
                <pointLight
                  position={[0, -8, 2]}
                  intensity={0.4}
                  color="#22d3ee"
                />
                <pointLight
                  position={[0, 8, -2]}
                  intensity={0.5}
                  color="#dbeafe"
                />

                <DNAModel />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}

useGLTF.preload("/DNA_STRAND_NEW.glb");