function hueLight(id) {

    const getLightState = async () => await this._bridge.lights.getLightState(id);
    const setLightState = async (state) => await this._bridge.lights.setLightState(id, state);

    return {

        // * Set power state
        on: async () => await setLightState({on: true}),
        off: async () => await setLightState({on: false}),

        // * Toggle power state
        power: async () => {
            const currentState = await getLightState();
            return await setLightState({on: !currentState.on});
        },

        brightness: async (brightness) => {
            const briVal = ((brightness / 100) * 253) + 1; // Accepts a percentage (0 - 100), converts to bri value (1 - 254)
            return await setLightState({bri: briVal})
        },
        colorHex: async (h) => {

            // Convert hex colour code to RGB
            let r = 0, g = 0, b = 0;

            // 3 digits
            if (h.length === 4) {
                r = "0x" + h[1] + h[1];
                g = "0x" + h[2] + h[2];
                b = "0x" + h[3] + h[3];
        
            // 6 digits
            } else if (h.length === 7) {
                r = "0x" + h[1] + h[2];
                g = "0x" + h[3] + h[4];
                b = "0x" + h[5] + h[6];
            }

            return await setLightState({rgb: [r, g, b]})
        },
        color: async (r, g, b) => await setLightState({rgb: [r, g, b]}),
        spectrum: async (enable = true) => await setLightState({effect: enable ? 'colorloop' : 'none'}),
        
        findMe: async () => await setLightState({alert: 'select'}),

        // * Get or set light state directly
        getState: getLightState,
        setState: setLightState
    }
}

module.exports = hueLight;