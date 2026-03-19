const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID
const Collection_ID = import.meta.env.VITE_COLLECTION_ID

export const updateSearchCount = async () => {
console.log(PROJECT_ID, DATABASE_ID, Collection_ID);
}
