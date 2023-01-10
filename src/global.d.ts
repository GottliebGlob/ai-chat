type User = {
    id: string
    name: string
}

type Contact = {
    id: string
    name: string
    chat_id: string
}

type Message = {
    id: string
    content: string
    user_from: string
    chat_id: string
    created_at: Date
}