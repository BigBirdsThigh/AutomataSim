const colours = () => {
    const colour = {
        0: "orange",        // A bright, vibrant orange
        1: "lightgreen",    // A soft, pastel green
        2: "skyblue",       // A light, refreshing blue
        3: "violet",        // A soft purple
        4: "coral",         // A warm, soft pinkish-orange
        5: "lightgoldenrodyellow", // A pale yellow that is easy on the eyes
        6: "turquoise",     // A bright, blue-green color
        7: "salmon",        // A soft, warm pink
        8: "lightseagreen", // A deep yet soft green-blue
        9: "peachpuff"      // A light, warm peach color        
    }

    const getColour = () => {
        const num = Math.floor(Math.random() * 4)
        return colour[num]
    }

    return { getColour }

}

export default colours;