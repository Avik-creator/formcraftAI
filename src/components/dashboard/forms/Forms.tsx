'use client';

import { Fragment, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import FormCard from './FormCard';
import DeleteFormModal from './DeleteFormModal';

import { useFormsQuery } from '@/data-fetching/client/form';
import useDeleteForm from '@/hooks/(dashboard)/forms/useDeleteForm';
import useEditForm from '@/hooks/(dashboard)/forms/useEditForm';
import { Combobox, Option } from '@/components/ui/combobox';
import { Search } from 'lucide-react';

const filterOptions = [
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Draft',
    value: 'draft',
  },
];

const Forms = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(null);
  const { data: forms } = useFormsQuery();

  const { deleteFormMutation, formIdToDelete, handleFormDelete: handleFormDeleteFn } = useDeleteForm();

  const { handleFormEdit } = useEditForm();

  const handleFormDelete = (id: string) => {
    handleFormDeleteFn(id, () => {
      setIsDeleteModalOpen(true);
    });
  };

  const filteredForms = useMemo(
    () =>
      forms?.filter(
        (f) =>
          f?.status?.includes((selectedStatus?.value as string) || '') &&
          f?.name?.toLowerCase()?.includes(query?.toLowerCase()),
      ),
    [forms, query, selectedStatus?.value],
  );

  return (
    <Fragment>
      <div className="flex flex-col gap-6">
        <header className="sticky top-0 z-30 -mx-2 px-2 sm:-mx-4 sm:px-4 pt-3 pb-4 bg-black/30 backdrop-blur-sm border-b border-zinc-800/50">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300 tracking-tight">
                My Forms
              </h1>
              <p className="text-zinc-400 text-sm">
                {filteredForms?.length || 0} form{(filteredForms?.length || 0) !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-[420px] md:w-[500px]">
                <label htmlFor="search-forms" className="sr-only">
                  Search Forms
                </label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="search-forms"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-11 bg-zinc-900/30 border-zinc-800/60 pl-9 backdrop-blur-sm focus:border-zinc-700/70 transition-all placeholder:text-zinc-500 text-white focus:ring-0"
                  placeholder="Quickly find your forms..."
                  type="search"
                />
              </div>
              <Combobox
                triggerStyle={{ width: 170, height: 44 }}
                triggerClassName="h-11"
                placeholder="Filter by status"
                options={filterOptions}
                selectedValues={[selectedStatus as Option]}
                allowMultiple={false}
                handleChange={(v) => setSelectedStatus(v?.[0])}
              />
            </div>
          </div>
        </header>
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 rounded-lg">
          {filteredForms?.map((form) => (
            <FormCard key={form.id} id={form.id} {...form?.meta} onDelete={handleFormDelete} onEdit={handleFormEdit} />
          ))}

          {filteredForms?.length === 0 && (
            <div className="col-span-full flex flex-col gap-3 mt-16 justify-center items-center text-zinc-400">
              <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                <Search className="w-7 h-7 text-zinc-500" />
              </div>
              <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                No forms found
              </h4>
              <p className="text-sm max-w-[80%] text-center">Try a different search or create a new form.</p>
            </div>
          )}
        </section>
      </div>
      <DeleteFormModal
        label={'Delete Form'}
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onConfirm={() => deleteFormMutation({ id: formIdToDelete as string })}
        showTrigger={false}
      />
    </Fragment>
  );
};

export default Forms;
