import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { 
  searchMedicalTerms, 
  searchDrugs, 
  searchICD10, 
  searchCPT,
  searchLabValues,
  MedicalTerm,
  DrugInfo,
  ICDCode,
  CPTCode,
  LabValue
} from '@/lib/medical-terminology';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface SuggestionItem {
  id: string;
  type: 'term' | 'drug' | 'icd10' | 'cpt' | 'lab';
  title: string;
  subtitle?: string;
  description?: string;
  data: MedicalTerm | DrugInfo | ICDCode | CPTCode | LabValue;
}

interface MentionListProps {
  items: SuggestionItem[];
  command: (item: SuggestionItem) => void;
}

const MentionList = forwardRef<any, MentionListProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'term':
        return '📚';
      case 'drug':
        return '💊';
      case 'icd10':
        return '🏥';
      case 'cpt':
        return '⚕️';
      case 'lab':
        return '🧪';
      default:
        return '📋';
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'term':
        return 'border-l-blue-500 bg-blue-50';
      case 'drug':
        return 'border-l-green-500 bg-green-50';
      case 'icd10':
        return 'border-l-red-500 bg-red-50';
      case 'cpt':
        return 'border-l-purple-500 bg-purple-50';
      case 'lab':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto min-w-80">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`
              w-full text-left px-4 py-3 border-l-4 hover:bg-gray-50 transition-colors
              ${index === selectedIndex ? 'bg-gray-100' : ''}
              ${getItemColor(item.type)}
            `}
            onClick={() => selectItem(index)}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{getItemIcon(item.type)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 truncate">
                    {item.title}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                    {item.type}
                  </span>
                </div>
                {item.subtitle && (
                  <div className="text-sm text-gray-600 mt-1">
                    {item.subtitle}
                  </div>
                )}
                {item.description && (
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-gray-500 text-center">
          No medical terms found
        </div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList';

export const MedicalMentionSuggestion = {
  items: ({ query }: { query: string }): SuggestionItem[] => {
    if (!query || query.length < 2) return [];

    const suggestions: SuggestionItem[] = [];

    // Search medical terms
    const terms = searchMedicalTerms(query, 3);
    terms.forEach(term => {
      suggestions.push({
        id: `term-${term.term}`,
        type: 'term',
        title: term.term,
        subtitle: term.category,
        description: term.definition,
        data: term
      });
    });

    // Search drugs
    const drugs = searchDrugs(query, 3);
    drugs.forEach(drug => {
      suggestions.push({
        id: `drug-${drug.name}`,
        type: 'drug',
        title: drug.name,
        subtitle: drug.category,
        description: drug.indication,
        data: drug
      });
    });

    // Search ICD-10 codes
    const icdCodes = searchICD10(query, 2);
    icdCodes.forEach(code => {
      suggestions.push({
        id: `icd10-${code.code}`,
        type: 'icd10',
        title: `${code.code} - ${code.description}`,
        subtitle: 'ICD-10',
        description: code.category,
        data: code
      });
    });

    // Search CPT codes
    const cptCodes = searchCPT(query, 2);
    cptCodes.forEach(code => {
      suggestions.push({
        id: `cpt-${code.code}`,
        type: 'cpt',
        title: `${code.code} - ${code.description}`,
        subtitle: 'CPT',
        description: code.category,
        data: code
      });
    });

    // Search lab values
    const labValues = searchLabValues(query, 2);
    labValues.forEach(lab => {
      suggestions.push({
        id: `lab-${lab.name}`,
        type: 'lab',
        title: lab.name,
        subtitle: `${lab.category} (${lab.unit})`,
        description: lab.normalRange.text || 
                    (lab.normalRange.min && lab.normalRange.max 
                      ? `Normal: ${lab.normalRange.min}-${lab.normalRange.max} ${lab.unit}`
                      : lab.normalRange.max 
                        ? `Normal: <${lab.normalRange.max} ${lab.unit}`
                        : ''),
        data: lab
      });
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  },

  render: () => {
    let component: ReactRenderer<any>;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          theme: 'light-border',
          maxWidth: 'none',
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },

  command: ({ editor, range, props }: { editor: any; range: any; props: SuggestionItem }) => {
    // Insert the mention with appropriate formatting based on type
    let insertText = '';
    let attributes: any = {
      id: props.id,
      label: props.title,
      'data-type': props.type,
    };

    switch (props.type) {
      case 'drug':
        const drug = props.data as DrugInfo;
        insertText = drug.name;
        attributes['data-generic'] = drug.genericName;
        attributes['data-category'] = drug.category;
        break;
      case 'icd10':
        const icd = props.data as ICDCode;
        insertText = `${icd.code} (${icd.description})`;
        attributes['data-code'] = icd.code;
        break;
      case 'cpt':
        const cpt = props.data as CPTCode;
        insertText = `${cpt.code} (${cpt.description})`;
        attributes['data-code'] = cpt.code;
        break;
      case 'lab':
        const lab = props.data as LabValue;
        insertText = lab.name;
        attributes['data-unit'] = lab.unit;
        attributes['data-normal-range'] = JSON.stringify(lab.normalRange);
        break;
      default:
        const term = props.data as MedicalTerm;
        insertText = term.term;
        attributes['data-definition'] = term.definition;
        break;
    }

    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'mention',
          attrs: attributes,
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run();
  },
};