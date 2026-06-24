"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets data-reading="true" on body when on article pages,
 * so the diagonal grid animation is hidden during reading.
 */
export default function BodyRouteClass() {
    const pathname = usePathname();

    useEffect(() => {
        const isReading = pathname?.startsWith("/post/");
        if (isReading) {
            document.body.setAttribute("data-reading", "true");
        } else {
            document.body.removeAttribute("data-reading");
        }
        return () => {
            document.body.removeAttribute("data-reading");
        };
    }, [pathname]);

    return null;
}
