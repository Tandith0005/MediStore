export const fetchMedicines = async () => {
  try {
    const res = await fetch(
      `https://medi-store-server-tau.vercel.app/api/medicine`,
      {
        cache: "no-store",
      },
    );
    const medicines = await res.json();
    return medicines;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSpecificMedicine = async (id: string) => {
  try {
    const res = await fetch(
      `https://medi-store-server-tau.vercel.app/api/medicine/${id}`,
      { cache: "no-store", credentials: "include" },
    );
    const medicine = await res.json();
    return medicine;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMyMedicines = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicine/my`, {
      cache: "no-store",
      credentials: "include",
    });
    const medicines = await res.json();
    return medicines;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMedicine = async (id: string) => {
  try {
    await fetch(`https://medi-store-server-tau.vercel.app/api/medicine/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.log(error);
  }
};

// filter medicine ------------------
type FilterParams = {
  search?: string;
  category?: string;
  manufacturer?: string;
  minPrice?: string;
  maxPrice?: string;
};

export const fetchFilteredMedicines = async (params?: FilterParams) => {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).filter(
          ([_, v]) => v !== undefined && v !== "",
        ) as [string, string][],
      ).toString()
    : "";

  const res = await fetch(
    `https://medi-store-server-tau.vercel.app/api/medicine${query}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch medicines");
  }

  return res.json();
};