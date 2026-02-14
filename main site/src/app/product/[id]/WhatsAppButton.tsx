"use client";

import { trackLead } from "@/lib/api";

interface WhatsAppButtonProps {
    href: string;
    productId: string;
    children: React.ReactNode;
}

export function WhatsAppButton({ href, productId, children }: WhatsAppButtonProps) {
    function handleClick() {
        trackLead(productId);
    }

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="w-full" onClick={handleClick}>
            {children}
        </a>
    );
}
