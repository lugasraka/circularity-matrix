"use client";

import { useState, useMemo } from "react";
import { productPresets, getPresetCategories, searchPresets, ProductPreset } from "../lib/presets";
import { rStrategyPresets, getPresetCategories as getRStrategyPresetCategories, searchPresets as searchRStrategyPresets, RStrategyPreset } from "../lib/r-strategy/presets";

interface PresetSelectorProps {
  onSelectPreset: (preset: ProductPreset) => void;
  onSelectRStrategyPreset?: (preset: RStrategyPreset) => void;
  onSkip: () => void;
}

export default function PresetSelector({ 
  onSelectPreset, 
  onSelectRStrategyPreset,
  onSkip 
}: PresetSelectorProps) {
  const [activeTab, setActiveTab] = useState<"hbr" | "r-strategy">("r-strategy");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isRStrategy = activeTab === "r-strategy";

  // Get categories based on active tab
  const categories = useMemo(() => {
    if (isRStrategy) {
      return getRStrategyPresetCategories();
    }
    return getPresetCategories();
  }, [isRStrategy]);

  // Get filtered presets based on active tab
  const filteredPresets = useMemo(() => {
    if (isRStrategy) {
      if (searchQuery) {
        return searchRStrategyPresets(searchQuery);
      }
      if (selectedCategory) {
        return rStrategyPresets.filter((p) => p.category === selectedCategory);
      }
      return rStrategyPresets;
    } else {
      if (searchQuery) {
        return searchPresets(searchQuery);
      }
      if (selectedCategory) {
        return productPresets.filter((p) => p.category === selectedCategory);
      }
      return productPresets;
    }
  }, [searchQuery, selectedCategory, isRStrategy]);

  // Group presets by category
  const groupedHBRPresets = useMemo(() => {
    const groups: Record<string, ProductPreset[]> = {};
    const presetsToGroup = searchQuery 
      ? searchPresets(searchQuery) 
      : selectedCategory 
        ? productPresets.filter((p) => p.category === selectedCategory)
        : productPresets;
    
    presetsToGroup.forEach((preset) => {
      if (!groups[preset.category]) {
        groups[preset.category] = [];
      }
      groups[preset.category].push(preset);
    });
    return groups;
  }, [searchQuery, selectedCategory]);

  const groupedRStrategyPresets = useMemo(() => {
    const groups: Record<string, RStrategyPreset[]> = {};
    const presetsToGroup = searchQuery 
      ? searchRStrategyPresets(searchQuery) 
      : selectedCategory 
        ? rStrategyPresets.filter((p) => p.category === selectedCategory)
        : rStrategyPresets;
    
    presetsToGroup.forEach((preset) => {
      if (!groups[preset.category]) {
        groups[preset.category] = [];
      }
      groups[preset.category].push(preset);
    });
    return groups;
  }, [searchQuery, selectedCategory]);

  const groupedPresets = isRStrategy ? groupedRStrategyPresets : groupedHBRPresets;

  const handleSelectPreset = (preset: ProductPreset | RStrategyPreset) => {
    if (isRStrategy && onSelectRStrategyPreset) {
      onSelectRStrategyPreset(preset as RStrategyPreset);
    } else {
      onSelectPreset(preset as ProductPreset);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Start with a Template
        </h3>
        <p className="text-sm text-gray-600">
          Select a product category to pre-fill typical characteristics. You can customize all answers afterward.
        </p>
      </div>

      {/* Framework tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setActiveTab("r-strategy");
            setSelectedCategory(null);
            setSearchQuery("");
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "r-strategy"
              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          R-Strategy Scorecard
          <span className="block text-xs font-normal opacity-75">{rStrategyPresets.length} templates</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("hbr");
            setSelectedCategory(null);
            setSearchQuery("");
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "hbr"
              ? "bg-blue-100 text-blue-700 border border-blue-300"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          HBR Matrix
          <span className="block text-xs font-normal opacity-75">{productPresets.length} templates</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setSelectedCategory(null);
            }}
            placeholder="Search products (e.g., phone, chair, packaging)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category filters */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? activeTab === "r-strategy" 
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? activeTab === "r-strategy"
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Preset grid */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {Object.entries(groupedPresets).map(([category, presets]) => (
          <div key={category}>
            {!searchQuery && (
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {category}
              </h4>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(presets as (ProductPreset | RStrategyPreset)[]).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3 rounded-lg border transition-all group ${
                    activeTab === "r-strategy"
                      ? "hover:border-emerald-300 hover:bg-emerald-50"
                      : "hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className={`font-medium text-gray-900 ${
                    activeTab === "r-strategy" ? "group-hover:text-emerald-700" : "group-hover:text-blue-700"
                  }`}>
                    {preset.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {preset.description}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preset.typicalUseCases.slice(0, 2).map((use) => (
                      <span
                        key={use}
                        className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                  {isRStrategy && (
                    <div className="mt-2 text-[10px] text-emerald-600 font-medium">
                      Expected: {(preset as RStrategyPreset).expectedPrimary}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No templates found matching &quot;{searchQuery}&quot;</p>
          <p className="text-sm mt-1">Try a different search or start from scratch</p>
        </div>
      )}

      {/* Skip button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Start from scratch without a template →
        </button>
      </div>
    </div>
  );
}
