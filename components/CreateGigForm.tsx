import React from "react";
import { z } from "zod";
import Box from "@/components/Box";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { useTheme } from "@/hooks/useTheme.hook";
import useForm from "@/hooks/useForm.hook";
import ThemedText from "./ThemedText";
import { COMMON_SKILLS } from "@/constants/gigs.constants";

export default function CreateGigForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const form = useForm([
    {
      name: "title",
      value: "",
      schema: z.string().min(10, "Title must be at least 10 characters"),
    },
    {
      name: "description",
      value: "",
      schema: z.string().min(30, "Description must be at least 30 characters"),
    },
    {
      name: "price",
      value: "",
      schema: z.string().min(1, "Price is required"),
    },
    {
      name: "skills",
      value: [],
      schema: z.array(z.string()).min(1, "Select at least one skill"),
    },
  ]);

  const handleSubmit = () => {
    form.validateForm((data) => {
      onSubmit({
        ...data,
        price: parseFloat(data.price),
      });
    });
  };

  return (
    <Box gap={15}>
      <ThemedTextInput
        label="Title"
        value={form.getFormValue("title")}
        onChangeText={(value) => form.setFormValue("title", value)}
        placeholder="Enter gig title"
      />

      <ThemedTextInput
        label="Description"
        value={form.getFormValue("description")}
        onChangeText={(value) => form.setFormValue("description", value)}
        placeholder="Enter gig description"
        multiline
        numberOfLines={4}
      />

      <ThemedTextInput
        label="Price"
        value={form.getFormValue("price")}
        onChangeText={(value) => form.setFormValue("price", value)}
        placeholder="Enter price"
        keyboardType="numeric"
        leftSlot={<ThemedText color="lightText">$</ThemedText>}
      />

      <Box gap={10}>
        <ThemedText fontWeight="bold">Skills</ThemedText>
        <Box direction="row" gap={5} wrap="wrap">
          {COMMON_SKILLS.map((skill) => (
            <ThemedButton
              key={skill}
              type={
                form.getFormValue("skills").includes(skill)
                  ? "primary"
                  : "surface"
              }
              label={skill}
              size="xs"
              onPress={() => {
                const currentSkills = form.getFormValue("skills");
                const newSkills = currentSkills.includes(skill)
                  ? currentSkills.filter((s: any) => s !== skill)
                  : [...currentSkills, skill];
                form.setFormValue("skills", newSkills);
              }}
            />
          ))}
        </Box>
      </Box>

      <ThemedButton
        type="primary"
        label="Create Gig"
        onPress={handleSubmit}
        loading={isLoading}
      />
    </Box>
  );
}
