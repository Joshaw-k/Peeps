export const userSchema = {
    address: 'string',
    username: 'string',
    bio: 'string',
    profilePic: 'string',
    dateJoined: 'string',
    walletPassword: 'string',
    createdAt: 'string'
}

export const postSchema = {
    address: 'string',
    user: {
        username: 'string',
        profilePic: 'string'
    },
    content: {
        message: 'string',
        upload: 'string[]',
        uploadType: 'enum'
    },
    comments: 'number',
    reposts: 'number',
    createdAt: 'string',
}

export const commentSchema = {
    address: 'string',
    postId: 'number',
    post: {
        address: 'string',
        user: {
            username: 'string',
            profilePic: 'string'
        },
        content: {
            message: 'string',
            upload: 'string[]',
            uploadType: 'enum'
        },
        comments: 'number',
        reposts: 'number',
        createdAt: 'string'
    },
    message: 'string',
    upload: 'string[]',
    uploadType: 'enum',
    createdAt: 'string'
}

export const likesSchema = {
    postId: 'number',
    createdAt: 'string'
}

export const trendingPostsSchema = {
    word: 'string',
    repostCount: 'number',
    createdAt: 'string'
}