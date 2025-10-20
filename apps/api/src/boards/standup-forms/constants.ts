export const DEFAULT_STANDUP_FORM_SCHEMA = {
  fields: [
    {
      name: 'yesterday',
      label: 'What did you do yesterday?',
      placeholder: 'Write your reply here...',
      type: 'textarea',
      required: true,
    },
    {
      name: 'today',
      label: 'What will you do today?',
      placeholder: 'Write your reply here...',
      type: 'textarea',
      required: true,
    },
    {
      name: 'blockers',
      label: 'Do you have any blockers?',
      placeholder: 'Write your reply here...',
      description:
        'Share any challenges or obstacles that might slow down your progress',
      type: 'textarea',
      required: false,
    },
  ],
};
