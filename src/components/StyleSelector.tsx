import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

interface StyleSelectorProps {
  styles: any[];
  categories: any[];
  selectedStyle: string;
  onStyleChange: (value: string) => void;
}

export default function StyleSelector({ styles, categories, selectedStyle, onStyleChange }: StyleSelectorProps) {
  // 按分類組織風格
  const stylesByCategory = categories.map(category => ({
    ...category,
    styles: styles.filter(s => s.category === category.id)
  }));

  return (
    <div className="space-y-2">
      <Label>🎨 藝術風格</Label>
      <Select value={selectedStyle} onValueChange={onStyleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="選擇風格" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {stylesByCategory.map(category => (
            category.styles.length > 0 && (
              <SelectGroup key={category.id}>
                <SelectLabel>{category.icon} {category.name}</SelectLabel>
                {category.styles.map((style: any) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.icon} {style.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            )
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        ✨ {styles.length} 種風格可選，分 {categories.length} 大類
      </p>
    </div>
  );
}
