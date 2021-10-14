import { reactive, toRefs } from "vue"

export const useTimestamp = () => {

    const state = reactive({
        timeFormatter: Intl.DateTimeFormat('fr', { hour: '2-digit', minute: '2-digit' }),
        dateFormater: Intl.DateTimeFormat('fr', { dateStyle: 'full' }),
    })

    // Permet de formatter un timestamp en heures et minutes
    function formatTimestamp (ts) {
        return state.timeFormatter.format(ts);
    }

    // Permet de récupérer la durée formatter entre 2 timestamp
    function durationBetweenTimestamps (start, end) 
    {
        // console.log(start, end);
        let seconds = Math.floor((end / 1000) - (start / 1000));
        let minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        seconds = seconds % 60;
        minutes = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    return {
        ...toRefs(state),
        formatTimestamp,
        durationBetweenTimestamps
    }
}