const colours = () => {
    const colour = {
        0:"red",
        1:"green",
        2:"blue",
        3:"yellow",        
    }

    const getColour = () => {
        const num = Math.floor(Math.random() * 4)
        return colour[num]
    }

    return { getColour }

}

export default colours;