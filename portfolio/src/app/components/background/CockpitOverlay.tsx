// 'use client';

// import React from 'react';

// export default function CockpitOverlay() {
//     return (
//         <div className="cockpit pointer-events-none fixed inset-0 overflow-hidden z-0">
//             {/* Top center trapezoid window */}
//             <div
//                 className="absolute top-0 w-full h-[60vh] bg-white/1 backdrop-blur-xs"
//                 style={{
//                     clipPath: 'polygon(20% 0, 80% 0, 62% 100%, 38% 100%)',
//                 }}
//             />

//             {/* Bottom center trapezoid window */}
//             <div
//                 className="absolute bottom-0 w-full h-[39.75vh] bg-white/1 backdrop-blur-xs"
//                 style={{
//                     clipPath: 'polygon(38% 0%, 62% 0%, 80% 100%, 20% 100%)',
//                 }}
//             />

//             {/* Left side faceted panel (half-octagon shape) */}
//             <div
//                 className="absolute top-0 left-0 w-1/2 h-full bg-white/2 backdrop-blur-sm"
//                 style={{
//                     clipPath: `
//             polygon(
//               0% 0%,       /* top-left corner */
//               -38% 0%,      /* upper taper */
//               20% 0%,      /* match top trapezoid start */
//               34% -8%,     /* mid edge toward center */
//               75% 60%,    /* bottom join with lower trapezoid */
//               39% 100%,    /* lower taper return */
//               10% 100%,    /* taper out */
//               0% 100%      /* bottom-left corner */
//             )
//           `,
//                 }}
//             />

//             {/* Right side faceted panel (half-octagon shape) */}
//             {/* Right side faceted panel (half-octagon shape, mirrored) */}
//             <div
//                 className="absolute top-0 right-0 w-1/2 h-full bg-white/2 backdrop-blur-xs"
//                 style={{
//                     clipPath: `
//       polygon(
//         100% 0%,       /* top-right corner */
//         138% 0%,       /* upper taper beyond view */
//         80% 0%,        /* match top trapezoid end */
//         66% -8%,       /* mid edge toward center (mirrored) */
//         25% 60%,       /* bottom join with lower trapezoid (mirrored) */
//         61% 100%,      /* lower taper return */
//         90% 100%,      /* taper out */
//         100% 100%      /* bottom-right corner */
//       )
//     `,
//                 }}
//             />

//         </div>
//     );
// }
