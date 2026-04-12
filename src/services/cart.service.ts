import React from 'react';

export const fetchCart = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {cache: "no-store", credentials: "include"});
        const cart = await res.json();
        return cart;
    } catch (error) {
        console.log(error);
    }
};


export const upsertCart = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`, {method: "PATCH", credentials: "include"});
        const cart = await res.json();
        return cart;
    } catch (error) {
        console.log(error);
    }
};
export const minusCart = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/minus/${id}`, {method: "PATCH", credentials: "include"});
        const cart = await res.json();
        return cart;
    } catch (error) {
        console.log(error);
    }
};

export const deleteItemsInCart = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`, {method: "DELETE", credentials: "include"});
        const cart = await res.json();
        return cart;
    } catch (error) {
        console.log(error);
    }
};