export const calculateRepost = (value: number) => {
    return value / 1000;
}

export const shortenAddress = (addr: string) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};

export function classNames(...classes: []) {
    return classes.filter(Boolean).join(' ')
}