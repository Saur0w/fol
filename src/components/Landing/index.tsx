"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import Image from "next/image";
import { getLenisInstance } from "@/lib/Scoll";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface LandingItem {
    id: number;
    src: string;
    alt: string;
    title: string;
}

const landingData: LandingItem[] = [
    { id: 1, src: "/images/ylw.png", alt: "Image 1", title: "ARCHIVE_05" },
    { id: 2, src: "/images/blue.jpg", alt: "Image 2", title: "COLLECTION_06" },
    { id: 3, src: "/images/2.jpg", alt: "Image 3", title: "VOLUME_04" },
    { id: 4, src: "/images/3.jpg", alt: "Image 4", title: "EDITION_09" },
    { id: 5, src: "/images/flw.jpg", alt: "Image 5", title: "PROJECT_12" },
    { id: 6, src: "/images/4.jpg", alt: "Image 6", title: "CONCEPT_02" },
    { id: 7, src: "/images/main.jpg", alt: "Image 7", title: "ELEMENT_07" },
    { id: 8, src: "/images/5.jpg", alt: "Image 8", title: "SYSTEM_11" },
    { id: 9, src: "/images/11.jpg", alt: "Image 9", title: "PERSPECTIVE_01" },
    { id: 10, src: "/images/9.jpg", alt: "Image 10", title: "ARTIFACT_03" }
];

const TOTAL = landingData.length;

export default function Landing() {
    const landingRef = useRef<HTMLDivElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    useGSAP(() => {
        const images = gsap.utils.toArray<HTMLElement>(".js-image");
        const innerImages = gsap.utils.toArray<HTMLElement>(".js-inner-image");
        const texts = gsap.utils.toArray<HTMLElement>(".js-text");
        const thumbs = gsap.utils.toArray<HTMLElement>(".js-thumb");

        if (!images.length || !innerImages.length || !texts.length || !thumbs.length) {
            return;
        }

        const splitTexts = texts.map((text) => new SplitText(text, { type: "chars" }));

        // Initial setup — everything past the first slide starts hidden below
        gsap.set(images.slice(1), { yPercent: 100 });
        gsap.set(innerImages.slice(1), { yPercent: -30 });
        gsap.set(texts.slice(1), { opacity: 0 });
        splitTexts.slice(1).forEach((split) => gsap.set(split.chars, { opacity: 0, y: 60 }));
        gsap.set(thumbs.slice(1), { opacity: 0.35 });

        let currentIndex = 0;
        let isAnimating = false;

        const resetStray = (idx: number, targetIndex: number) => {
            const isBelow = idx > targetIndex;
            gsap.set(images[idx], { yPercent: isBelow ? 100 : -100 });
            gsap.set(innerImages[idx], { yPercent: isBelow ? -30 : 30 });
            gsap.set(texts[idx], { opacity: 0 });
            gsap.set(splitTexts[idx].chars, { opacity: 0, y: isBelow ? 60 : -60 });
            gsap.set(thumbs[idx], { opacity: 0.35 });
        };

        const goToIndex = (targetIndex: number, programmaticScroll = false) => {
            if (targetIndex === currentIndex || isAnimating) return;
            isAnimating = true;

            const prevIndex = currentIndex;
            const direction = targetIndex > prevIndex ? 1 : -1;

            images.forEach((_, idx) => {
                if (idx !== targetIndex && idx !== prevIndex) {
                    resetStray(idx, targetIndex);
                }
            });

            currentIndex = targetIndex;

            const prevImg = images[prevIndex];
            const prevInner = innerImages[prevIndex];
            const prevSplit = splitTexts[prevIndex];
            const prevThumb = thumbs[prevIndex];
            const currentImg = images[targetIndex];
            const currentInner = innerImages[targetIndex];
            const currentText = texts[targetIndex];
            const currentSplit = splitTexts[targetIndex];
            const currentThumb = thumbs[targetIndex];

            if (!programmaticScroll && scrollTriggerRef.current) {
                const trigger = scrollTriggerRef.current;
                const progress = targetIndex / (TOTAL - 1);
                const targetY = trigger.start + progress * (trigger.end - trigger.start);
                const lenis = getLenisInstance();

                if (lenis) {
                    lenis.scrollTo(targetY, { duration: 0.8, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                }
            }

            const tl = gsap.timeline({
                defaults: { force3D: true },
                onComplete: () => {
                    gsap.delayedCall(0.1, () => {
                        isAnimating = false;
                    });
                }
            });

            if (direction === 1) {
                tl
                    .to(prevImg, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, 0)
                    .to(prevInner, { yPercent: 30, duration: 0.8, ease: "expo.inOut" }, 0)
                    .to(prevSplit.chars, { y: -30, opacity: 0, stagger: 0.004, duration: 0.4 }, 0)
                    .to(prevThumb, { opacity: 0.35, duration: 0.4 }, 0)

                    .fromTo(currentImg, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0)
                    .fromTo(currentInner, { yPercent: -30 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0)
                    .to(currentText, { opacity: 1, duration: 0.1 }, 0)
                    .to(currentThumb, { opacity: 1, duration: 0.4 }, 0.2)
                    .fromTo(
                        currentSplit.chars,
                        { y: 40, opacity: 0 },
                        { y: 0, opacity: 1, stagger: 0.005, duration: 0.5, ease: "power4.out" },
                        0.2
                    );
            } else {
                tl
                    .to(prevImg, { yPercent: 100, duration: 0.8, ease: "expo.inOut" }, 0)
                    .to(prevInner, { yPercent: -30, duration: 0.8, ease: "expo.inOut" }, 0)
                    .to(prevSplit.chars, { y: 30, opacity: 0, stagger: 0.004, duration: 0.4 }, 0)
                    .to(prevThumb, { opacity: 0.35, duration: 0.4 }, 0)

                    .fromTo(currentImg, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0)
                    .fromTo(currentInner, { yPercent: 30 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0)
                    .to(currentText, { opacity: 1, duration: 0.1 }, 0)
                    .to(currentThumb, { opacity: 1, duration: 0.4 }, 0.2)
                    .fromTo(
                        currentSplit.chars,
                        { y: -40, opacity: 0 },
                        { y: 0, opacity: 1, stagger: 0.005, duration: 0.5, ease: "power4.out" },
                        0.2
                    );
            }
        };

        const st = ScrollTrigger.create({
            trigger: landingRef.current,
            start: "top top",
            end: () => `+=${TOTAL * 60}%`,
            pin: true,
            onUpdate: (self) => {
                const progressPerSlide = 1 / (TOTAL - 1);
                const targetIndex = Math.min(
                    Math.max(Math.round(self.progress / progressPerSlide), 0),
                    TOTAL - 1
                );
                goToIndex(targetIndex, false);
            }
        });

        scrollTriggerRef.current = st;
        const clickHandlers: Array<() => void> = [];

        thumbs.forEach((thumb, idx) => {
            const handler = () => {
                const trigger = scrollTriggerRef.current;
                if (!trigger) return;

                const progress = idx / (TOTAL - 1);
                const y = trigger.start + progress * (trigger.end - trigger.start);
                const lenis = getLenisInstance();

                if (lenis) {
                    lenis.scrollTo(y, { immediate: false, duration: 0.8 });
                } else {
                    window.scrollTo(0, y);
                }

                goToIndex(idx, true);
            };

            thumb.addEventListener("click", handler);
            clickHandlers[idx] = handler;
        });

        return () => {
            thumbs.forEach((thumb, idx) => {
                const handler = clickHandlers[idx];
                if (handler) thumb.removeEventListener("click", handler);
            });
            splitTexts.forEach((instance) => instance.revert());
            st.kill();
        };
    }, { scope: landingRef });

    return (
        <section className={styles.landing} ref={landingRef}>
            <div className={styles.centerContainer}>
                <div className={styles.imageLanding}>
                    {landingData.map((item) => (
                        <div key={item.id} className={`${styles.imageWrapper} js-image`}>
                            <div className={`${styles.innerImageContainer} js-inner-image`}>
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    sizes="(max-width: 768px) 320px, 380px"
                                    priority={item.id <= 3}
                                    loading={item.id > 3 ? "eager" : undefined}
                                    className={styles.actualImage}
                                    unoptimized
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.textLanding}>
                    {landingData.map((item) => (
                        <h2 key={item.id} className={`${styles.titleText} js-text`}>
                            {item.title}
                        </h2>
                    ))}
                </div>
            </div>

            <div className={styles.sidebarStrip}>
                {landingData.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`${styles.thumbWrapper} js-thumb`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                    >
                        <Image
                            src={item.src}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            sizes="44px"
                            className={styles.thumbImage}
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}