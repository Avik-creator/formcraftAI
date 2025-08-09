"use client";

import { Brush } from "lucide-react";
import FormConfigSection from "@/components/common/FormConfigSection";

import fields from "./fields";

const {
  FormFontPicker,
  FormThemePicker,
  FormFontPrimaryColor,
  FormFontSecondaryColor,
} = fields;

const FormCustomization = () => {
  return (
    <FormConfigSection
      icon={<Brush className="w-4 h-4 text-white/90" />}
      title="Form Appearance"
      subtitle="Make your form look like your brand."
    >
      <div className="flex flex-col gap-4 bg-background/30 px-3 py-4 border border-zinc-800 rounded-md min-w-100 bg-zinc-900/30 backdrop-blur-sm">
        <FormThemePicker />
        <div className="grid grid-cols-2 gap-4">
          <FormFontPrimaryColor />
          <FormFontSecondaryColor />
        </div>
        <FormFontPicker />
      </div>
    </FormConfigSection>
  );
};

export default FormCustomization;
