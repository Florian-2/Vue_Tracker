import axios from "axios";

const JSON_BIN_KEY = import.meta.env.VITE_JSONBIN_KEY;

const instance = axios.create({
    baseURL: 'https://api.jsonbin.io/v3/b/613cd59caa02be1d44466778',
    headers: {'X-Master-Key': JSON_BIN_KEY}
});

export async function getAllTask() {
    const res = await instance.get('/latest');
    console.info(`getAllTask ${res.config.method.toLocaleUpperCase()} - ${res.status} - ${res.data.record.length} élément(s)`);
    return res.data.record;
}

export async function updateTask(newTask) {
    const res = await instance.put('/', newTask);
    console.info(`updateAllTask ${res.config.method.toLocaleUpperCase()} - ${res.status} - ${res.data.record.length} élément(s)`);
}