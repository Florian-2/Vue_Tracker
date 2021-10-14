import { createStore, createLogger } from 'vuex'
import TasksModule from './modules/tasks.js'
import NotificationModule from './modules/notification.js'
import UserModule from './modules/users.js'

const store = createStore({
    modules: {
        m_tasks: TasksModule,
        m_notif: NotificationModule,
        m_user: UserModule
    },
    // Ne pas activer les Logger si le projet est en ligne (production)
    // plugins: import.meta.env.MODE != 'production' ? [createLogger()] : []
})

export default store