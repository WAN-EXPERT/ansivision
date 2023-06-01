import axios from "axios"

export const getPosts = () => {
    console.log("getPosts")
    return new Promise((onSuccess, onFail) => {
        axios.get('http://localhost:4000/api/posts').then((response, error) => {
            if (!response || error) {
                onFail(`Response failure ${error}`)
                return false
            }
            onSuccess(response)
        })
    })
}
export const getPostsBy = category => {
    return new Promise((onSuccess, onFail) => {
        axios.get(`http://localhost:4000/api/posts/${category}`).then((response, error) => {
            if (!response || error) {
                onFail(`Response failure ${error}`)
                return false
            }
            onSuccess(response)
        })
    })
}
export const getPostBy = id => {
    return new Promise((onSuccess, onFail) => { 
        axios.get(`http://localhost:4000/api/post/${id}`).then((response, error) => {
            if (!response || error) {
                onFail(`Response failure ${error}`)
                return false
            }
            onSuccess(response)
        })
    })
}
export const addPost = body => {
    return new Promise((onSuccess, onFail) => { 
        const post = {
            ...body, 
            createdAt: new Date()
        }
        axios.post('http://localhost:4000/api/post/add', post).then((response, error)=> {
            if (error) { 
                onFail(`error adding new post : ${error}`)
                return false
            }
            onSuccess(`post ${post.title} added successfully`)
        }).catch(err => onFail(err))
    })
}