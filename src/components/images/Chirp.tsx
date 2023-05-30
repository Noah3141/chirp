import * as React from "react";
const ChirpLogo = (props: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={props.size ?? 24}
        height={props.size ?? 24}
        className="text-slate-900 hover:text-yellow-400"
        viewBox="0 0 640 640"
        {...props}>
        <path
            d="M0-232.353c128.259 0 232.353 104.094 232.353 232.353 0 128.259-104.094 232.353-232.353 232.353-128.259 0-232.353-104.094-232.353-232.353 0-128.259 104.094-232.353 232.353-232.353z"
            style={{
                stroke: "#e11d48",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeDashoffset: 0,
                strokeLinejoin: "miter",
                strokeMiterlimit: 4,
                fill: "currentcolor",
                fillRule: "nonzero",
                opacity: 1,
            }}
            transform="matrix(1.27158 0 0 1.27158 318.53 320)"
            vectorEffect="non-scaling-stroke"
        />
        <path
            d="M4.17 345.869a7.968 7.968 0 0 1-3.258-10.703l19.606-37.402a6.785 6.785 0 0 1 10.637-1.812l109.573 102.18c21.897-37.406 61.783-111.819 80.702-186.677 26.016-102.94 20.554-138.858 12.288-206.682a4.258 4.258 0 0 1 5.541-4.565c74.004 24.036 157.301 48.593 187.124 134.123l99.552 21.397a5.11 5.11 0 0 1 1.061 9.638L437.742 206.4c.12 16.062-1.03 33.523-3.606 52.534-23.224 171.34-243.988 168.213-297.13 164.942l-76.152 20.586a6.404 6.404 0 0 1-6.343-1.802l-37.964-40.495a2.585 2.585 0 0 1 2.172-4.337l102.207 11.378z"
            style={{
                stroke: "#000",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeDashoffset: 0,
                strokeLinejoin: "miter",
                strokeMiterlimit: 4,
                fill: "#e11d48",
                fillRule: "nonzero",
                opacity: 1,
            }}
            transform="matrix(.94272 0 0 .94272 86.877 93.63)"
            vectorEffect="non-scaling-stroke"
        />
    </svg>
);
export default ChirpLogo;
