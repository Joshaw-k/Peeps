const symmetricDifference = require("./utils");

const userData = {
    "username": "Mayowa",
    "wallet": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "displayName": "Mayowa V1",
    "profilePicture": "",
    "bio": "I like the best things that I like.",
    "following": 0,
    "followers": 0,
    "createdAt": "2024-05-02T11:30:14.256Z"
}

const myPosts = [
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "1d8fc612-e794-4c93-84a3-c0b86df3b962",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Tech news of today is the announcement of the latest lineups of iPhones. These features the iPhone16, iPhone 16 pro, iPhone 16 pro max. The event is also expected to feature the latest iPad with new iPen. There's just a lot of i's to be released by apple. Can't wait.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:09:44.137Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "70cf3e79-1622-4717-97ac-917c85d51123",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "The reason any one ever calls you hero is because you clean up the disasters you unleash.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:04:50.486Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "f61ae93b-34c4-4c30-a486-82dac96b823b",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Patterns for a new post. To be clear. This is the new post.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:04:08.719Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "6bdd05a0-fc40-4628-9fb7-c63c33e0d9b0",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Another day that bitcoin hits a record low in recent times. Quite serious.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:03:22.676Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "b8683c99-99f8-489b-99cd-c7779dec98c3",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Enjoy the irony.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:02:49.141Z"
    }
]

const allPosts = [
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "1d8fc612-e794-4c93-84a3-c0b86df3b962",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Tech news of today is the announcement of the latest lineups of iPhones. These features the iPhone16, iPhone 16 pro, iPhone 16 pro max. The event is also expected to feature the latest iPad with new iPen. There's just a lot of i's to be released by apple. Can't wait.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:09:44.137Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "70cf3e79-1622-4717-97ac-917c85d51123",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "The reason any one ever calls you hero is because you clean up the disasters you unleash.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:04:50.486Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "f61ae93b-34c4-4c30-a486-82dac96b823b",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Patterns for a new post. To be clear. This is the new post.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:04:08.719Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "6bdd05a0-fc40-4628-9fb7-c63c33e0d9b0",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Another day that bitcoin hits a record low in recent times. Quite serious.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:03:22.676Z"
    },
    {
        "post_user": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "post_id": "b8683c99-99f8-489b-99cd-c7779dec98c3",
        "post_username": "Mayowa",
        "post_displayName": "Mayowa V1",
        "post_content": "Enjoy the irony.",
        "post_media": "",
        "post_comments": 0,
        "post_repeeps": 0,
        "post_likes": 0,
        "createdAt": "2024-05-02T12:02:49.141Z"
    }
]

// console.log(allPosts.filter(it => !myPosts.includes(it.post_id)))

const postMinus = symmetricDifference(allPosts, myPosts);
// console.log(postMinus);

function arrayDifference(array1, array2) {
    // Filter elements in array1 that are not present in array2
    const difference = array1.filter(post1 => !array2.some(post2 => post1.post_id === post2.post_id));
    return difference;
}

const difference = arrayDifference(myPosts, allPosts);
console.log("Difference:", difference);