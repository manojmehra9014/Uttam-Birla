import NetInfo from '@react-native-community/netinfo';
export default {
    token: null,
    userType: null,
    agentId: null,
    baseUrl: 'https://api.uttambirla.com',
    async checkInternetReachability() {
        const state = await NetInfo.fetch();
        const isInternetReachable = state.isConnected && state.isInternetReachable;

        if (!isInternetReachable) {
            return true; // Internet is not reachable
        }
        return false; // Internet is reachable
    },
};
