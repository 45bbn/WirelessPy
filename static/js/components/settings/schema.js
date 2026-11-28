// ---------- Settings Schema ----------
// id must be unique
// default must be a valid value for its type
// tab must match the ID of a tab container in HTML

export const SETTINGS_SCHEMA = [
    {
        id: "reduce_motion",
        tab: "graphics",
        section: "Visual Effects",
        type: "selector",
        label: "Reduce Motion",
        info: "Reduce animations and motion effects throughout the app",
        options: [
            { value: false, label: "OFF" },
            { value: true, label: "ON" },
        ],
        default: false,
    },
    {
        id: "blur_intensity",
        tab: "graphics",
        section: "Visual Effects",
        type: "slider",
        label: "Blur Intensity",
        info: "Adjust the intensity of the background blur",
        min: 0,
        max: 20,
        step: 1,
        default: 8,
        unit: "px",
        style: "arrows",
    },
    {
    id: "render_quality",
    tab: "graphics",
    section: "Wallpaper",
    type: "selector",
    label: "Rendering Quality",
    info: "Adjust the wallpaper rendering resolution to balance visual quality and performance",
    options: [
        { value: 0.4, label: "LOWEST" },
        { value: 0.75, label: "LOW" },
        { value: 1.0, label: "MEDIUM" },
        { value: 1.25, label: "HIGH" },
        { value: 1.5, label: "VERY HIGH" },
        { value: 2.0, label: "ULTRA" },
    ],
    default: 1.0,
    },
    {
        id: "cursor_spotlight",
        tab: "graphics",
        section: "Wallpaper",
        type: "selector",
        label: "Cursor Spotlight",
        info: "Toggle the Spotlight on Cursor Effect",
        options: [
            { value: false, label: "OFF" },
            { value: true, label: "ON" },
        ],
        default: true,
    },
    {
        id: "max_geometry",
        tab: "graphics",
        section: "Wallpaper",
        type: "slider",
        label: "Max Geometry Objects",
        info: "Limit how many shapes the wallpaper draws",
        min: 5,
        max: 100,
        step: 5,
        default: 20,
        unit: "",
    },
];