import PeepsAbi from "./abi.json";

export { PeepsAbi };

export const calculateRepost = (value: number) => {
    return value / 1000;
}

export const shortenAddress = (addr: string) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};

export function classNames(...classes: []) {
    return classes.filter(Boolean).join(' ')
}

export function formattedDate(_currentDate: any) {
    return _currentDate.toLocaleString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}
