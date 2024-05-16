// Sample user-post interactions (replace with your actual data)
const userPostInteractions = [
    { userId: 1, postId: 1 },
    { userId: 2, postId: 2 },
    { userId: 3, postId: 1 },
    { userId: 2, postId: 3 },
    { userId: 4, postId: 2 },
    // Add more interactions...
];

// Function to find similar users based on post interactions
function findSimilarUsers(userId, userPostInteractions, numSimilarUsers = 3) {
    // Filter interactions for the given user
    const userInteractions = userPostInteractions.filter(interaction => interaction.userId === userId);

    // Find users who interacted with similar posts
    const similarUsers = {};
    userInteractions.forEach(interaction => {
        const similarInteractions = userPostInteractions.filter(
            int => int.userId !== userId && int.postId === interaction.postId
        );
        similarInteractions.forEach(similarInteraction => {
            if (!similarUsers[similarInteraction.userId]) {
                similarUsers[similarInteraction.userId] = 1;
            } else {
                similarUsers[similarInteraction.userId]++;
            }
        });
    });

    // Sort similar users by the number of shared interactions
    const sortedSimilarUsers = Object.entries(similarUsers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, numSimilarUsers)
        .map(([userId]) => parseInt(userId));

    return sortedSimilarUsers;
}

// Function to recommend posts based on similar users' interactions
function recommendCollaborativePosts(userId, similarUsers, userPostInteractions, numPostsToRecommend = 5) {
    // Find posts interacted with by similar users
    const postsInteractedBySimilarUsers = userPostInteractions
        .filter(interaction => similarUsers.includes(interaction.userId))
        .map(interaction => interaction.postId);

    // Filter out posts already interacted with by the target user
    const postsToRecommend = Array.from(new Set(postsInteractedBySimilarUsers))
        .filter(postId => !userPostInteractions.some(interaction => interaction.userId === userId && interaction.postId === postId))
        .slice(0, numPostsToRecommend);

    return postsToRecommend;
}

// Sample usage
const targetUserId = 1;
const similarUsers = findSimilarUsers(targetUserId, userPostInteractions);
const collaborativePosts = recommendCollaborativePosts(targetUserId, similarUsers, userPostInteractions);

console.log(`Similar users for user ${targetUserId}:`, similarUsers);
console.log(`Recommended collaborative posts for user ${targetUserId}:`, collaborativePosts);
