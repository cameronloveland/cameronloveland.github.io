import React, { JSX } from 'react';
import { IconType } from 'react-icons';
import { SiReact, SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiNodedotjs, SiGithub, SiDocker, SiPython, SiVercel, SiGraphql, SiOpenai, SiFirebase, SiHtml5, SiCss3 } from 'react-icons/si';

const topicIconMap: Record<string, IconType> = {
    react: SiReact,
    nextjs: SiNextdotjs,
    tailwindcss: SiTailwindcss,
    javascript: SiJavascript,
    typescript: SiTypescript,
    node: SiNodedotjs,
    github: SiGithub,
    docker: SiDocker,
    python: SiPython,
    vercel: SiVercel,
    graphql: SiGraphql,
    openai: SiOpenai,
    firebase: SiFirebase,
    html: SiHtml5,
    css: SiCss3,
};
const topicColorMap: Record<string, string> = {
    react: "#61DAFB",
    nextjs: "#000000",
    tailwindcss: "#38BDF8",
    javascript: "#F7DF1E",
    typescript: "#3178C6",
    node: "#339933",
    github: "#181717",
    docker: "#2496ED",
    python: "#3776AB",
    vercel: "#000000",
    graphql: "#E10098",
    openai: "#10A37F",
    firebase: "#FFCA28",
    html: "#E34F26",
    css: "#1572B6",
};

export function TopicIcon(topic: string): JSX.Element {
    const key = topic.toLowerCase();
    const Icon = topicIconMap[key] || SiGithub;
    const color = topicColorMap[key] || "#999999";

    return <Icon className="text-sm" style={{ color }
    } />;
}
