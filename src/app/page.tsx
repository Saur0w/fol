"use client";

import styles from "./page.module.css";
import Landing from "@/components/Landing";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { setLenisInstance } from "@/lib/Scoll";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    useEffect(() => {
        const lenis = new Lenis();
        setLenisInstance(lenis);

        lenis.on("scroll", ScrollTrigger.update);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            setLenisInstance(null);
        };
    }, []);

    return (
        <div className={styles.page}>
            <Landing />
        </div>
    );
}