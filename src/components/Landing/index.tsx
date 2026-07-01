"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface LandingImage {
    id: number;
    src: string;
    alt: string;
}

const imageList: LandingImage[] = [
    {
        id: 1,
        src: "/images/landing/1.jpg",
        alt: "Image 1",
    },
    {
        id: 2,
        src: "/images/landing/blue.jpg",
        alt: "Image 2",
    },
    {
        id: 3,
        src: "/images/landing/2.jpg",
        alt: "Image 3",
    },
    {
        id: 4,
        src: "/images/landing/3.jpg",
        alt: "Image 4",
    },
    {
        id: 5,
        src: "/images/landing/main.jpg",
        alt: "Image 5",
    },
    {
        id: 6,
        src: "/images/landing/4.jpg",
        alt: "Image 6",
    },
    {
        id: 7,
        src: "/images/landing/main.jpg",
        alt: "Image 7",
    },
    {
        id: 8,
        src: "/images/landing/5.jpg",
        alt: "Image 8",
    },
    {
        id: 9,
        src: "/images/landing/11.jpg",
        alt: "Image 9",
    },
    {
        id: 10,
        src: "/images/landing/9.jpg",
        alt: "Image 10",
    }
]

export default function Landing() {
    const landingRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    return (
        <section className={styles.landing} ref={landingRef}>
            <div className={styles.imageLanding} ref={imageRef}>
                {imageList.map((image) => (
                    <div key={image.id} className={styles.imageWrapper}>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={600}
                            height={400}
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}