export function CommunityRecipeCard() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl bg-white p-6">
      <div className="text-sm text-slate-600 mb-2">Recipe Card</div>
      <h4 className="text-slate-900 mb-3">Protein Bowl</h4>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-slate-900">42g</div>
          <div className="text-xs text-slate-600">Protein</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-slate-900">35g</div>
          <div className="text-xs text-slate-600">Carbs</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-slate-900">18g</div>
          <div className="text-xs text-slate-600">Fats</div>
        </div>
      </div>
    </div>
  );
}
