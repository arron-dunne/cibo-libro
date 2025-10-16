"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EditRecipeFormProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    prepMins: number | null;
    cookMins: number | null;
    servings: number | null;
    ingredients: string[];
    steps: string[];
    tags: string[];
  };
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [prepMins, setPrepMins] = useState(recipe.prepMins ?? "");
  const [cookMins, setCookMins] = useState(recipe.cookMins ?? "");
  const [servings, setServings] = useState(recipe.servings ?? "");
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [steps, setSteps] = useState(recipe.steps);
  const [tags, setTags] = useState(recipe.tags);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateRecipe({
      id: recipe.id,
      title,
      description,
      prepMins: Number(prepMins) || null,
      cookMins: Number(cookMins) || null,
      servings: Number(servings) || null,
      ingredients,
      steps,
      tags,
    });

    setLoading(false);
    if (res.success) {
      toast.success("Recipe updated!");
      router.push(`/view/${res.slug}`);
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="prepMins">Prep (min)</Label>
          <Input
            id="prepMins"
            type="number"
            value={prepMins}
            onChange={(e) => setPrepMins(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cookMins">Cook (min)</Label>
          <Input
            id="cookMins"
            type="number"
            value={cookMins}
            onChange={(e) => setCookMins(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="servings">Servings</Label>
          <Input
            id="servings"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Ingredients</Label>
        {ingredients.map((ing, i) => (
          <Input
            key={i}
            value={ing}
            onChange={(e) => {
              const newArr = [...ingredients];
              newArr[i] = e.target.value;
              setIngredients(newArr);
            }}
            className="mb-2"
          />
        ))}
        <Button type="button" variant="secondary" onClick={() => setIngredients([...ingredients, ""])}>+ Add ingredient</Button>
      </div>

      <div>
        <Label>Steps</Label>
        {steps.map((st, i) => (
          <Textarea
            key={i}
            value={st}
            onChange={(e) => {
              const newArr = [...steps];
              newArr[i] = e.target.value;
              setSteps(newArr);
            }}
            rows={2}
            className="mb-2"
          />
        ))}
        <Button type="button" variant="secondary" onClick={() => setSteps([...steps, ""])}>+ Add step</Button>
      </div>

      <div>
        <Label>Tags (comma separated)</Label>
        <Input
          value={tags.join(", ")}
          onChange={(e) => setTags(e.target.value.split(",").map(t => t.trim()))}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
