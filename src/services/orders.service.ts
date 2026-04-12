export const fetchUserOrders = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {cache: "no-store", credentials: "include"});
    return res.json();
};

export const fetchSellerOrders = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/seller`, {cache: "no-store", credentials: "include"});
    return res.json();
};