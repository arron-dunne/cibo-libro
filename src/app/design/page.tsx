export default function DesignPage() {
    return (
        <div className="m-4">
            <h1 className="underline text-lg font-bold">Explore Cibo Libro Designs</h1>
            
            <h2 className="mt-4 font-semibold">All Recipes</h2>
            <ul className="ml-4 list-disc list-inside">
                <li><a href="/design/all">v1</a></li>
            </ul>

            <h2 className="mt-4 font-semibold">Cook Mode</h2>
            <ul className="ml-4 list-disc list-inside">
                <li><a href="/design/cook/v1">v1</a></li>
                <li><a href="/design/cook/v2">v2</a></li>
                <li><a href="/design/cook/v3">v3</a></li>
                <li><a href="/design/cook/v4">v4</a></li>
                <li><a href="/design/cook/v5">v5</a></li>
            </ul>

            <h2 className="mt-4 font-semibold">Import</h2>
            <ul className="mt-2 ml-4 list-disc list-inside">
                <li><a href="/design/import">v1</a></li>
            </ul>

            <h2 className="mt-4 font-semibold">Import Preview</h2>
            <ul className="mt-2 ml-4 list-disc list-inside">
                <li><a href="/design/import-preview">v1</a></li>
            </ul>

            <h2 className="mt-4 font-semibold">Link Card</h2>
            <ul className="mt-2 ml-4 list-disc list-inside">
                <li><a href="/design/linkcard">v1</a></li>
            </ul>
            
            <h2 className="mt-4 font-semibold">Recipe</h2>
            <ul className="mt-2 ml-4 list-disc list-inside">
                <li><a href="/design/recipe">v1</a></li>
            </ul>
            
        </div>
    )
}