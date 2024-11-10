import React, { useState } from "react";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import { useTheme } from "@/hooks/useTheme.hook";
import useForm from "@/hooks/useForm.hook";
import { COMMON_SKILLS, GIG_CATEGORIES } from "@/constants/gigs.constants";
import { BASE_URL } from "@/constants/network";

export default function CreateGigScreen() {
  const theme = useTheme();
  const { showToast } = useToast();

  const form = useForm([
    {
      name: "title",
      value: "",
      schema: z
        .string()
        .min(10, "Title should be at least 10 characters")
        .max(100, "Title should not exceed 100 characters"),
    },
    {
      name: "description",
      value: "",
      schema: z
        .string()
        .min(50, "Description should be at least 50 characters")
        .max(1000, "Description should not exceed 1000 characters"),
    },
    {
      name: "price",
      value: "",
      schema: z
        .string()
        .min(1, "Price is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    },
    {
      name: "category",
      value: "",
      schema: z.string().min(1, "Category is required"),
    },
    {
      name: "skills",
      value: [] as string[],
      schema: z
        .array(z.string())
        .min(1, "Select at least one skill")
        .max(5, "Maximum 5 skills allowed"),
    },
  ]);

  const createGigMutation = useMutation({
    mutationFn: async (data: typeof form.formState) => {
      return await postJson(`${BASE_URL}/gigs`, {
        ...data,
        price: parseFloat(data.price),
      });
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: "Gig created successfully",
          type: "success",
        });
        router.replace("/(tabs)/");
      } else {
        showToast({
          title: response.message || "Failed to create gig",
          type: "error",
        });
      }
    },
  });

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: "Create Gig",
      }}
    >
      <Box pa={20} gap={20}>
        {/* Title */}
        <ThemedTextInput
          label="Title"
          placeholder="e.g., I will create a professional mobile app design"
          value={form.getFormValue("title")}
          onChangeText={(value) => form.setFormValue("title", value)}
        />

        {/* Description */}
        <ThemedTextInput
          label="Description"
          placeholder="Describe your gig in detail..."
          value={form.getFormValue("description")}
          onChangeText={(value) => form.setFormValue("description", value)}
          multiline
          numberOfLines={4}
        />

        {/* Price */}
        <ThemedTextInput
          label="Price"
          placeholder="Enter your price"
          value={form.getFormValue("price")}
          onChangeText={(value) => form.setFormValue("price", value)}
          keyboardType="decimal-pad"
          leftSlot={
            <ThemedText color={theme.lightText} pa={10}>
              $
            </ThemedText>
          }
        />

        {/* Category */}
        <Box gap={10}>
          <ThemedText fontWeight="bold">Category</ThemedText>
          <Box direction="row" gap={10} wrap="wrap">
            {GIG_CATEGORIES.map((category) => (
              <ThemedButton
                key={category.id}
                type={
                  form.getFormValue("category") === category.id
                    ? "primary"
                    : "surface"
                }
                label={category.label}
                size="sm"
                onPress={() => form.setFormValue("category", category.id)}
              />
            ))}
          </Box>
        </Box>

        {/* Skills */}
        <Box gap={10}>
          <Box direction="row" justify="space-between" align="center">
            <ThemedText fontWeight="bold">Skills</ThemedText>
            <ThemedText size="sm" color={theme.lightText}>
              {form.getFormValue("skills").length}/5 selected
            </ThemedText>
          </Box>
          <Box direction="row" gap={10} wrap="wrap">
            {COMMON_SKILLS.map((skill) => (
              <ThemedButton
                key={skill}
                type={
                  form.getFormValue("skills").includes(skill)
                    ? "primary"
                    : "surface"
                }
                label={skill}
                size="sm"
                onPress={() => {
                  const currentSkills = form.getFormValue("skills");
                  if (currentSkills.includes(skill)) {
                    form.setFormValue(
                      "skills",
                      currentSkills.filter((s) => s !== skill)
                    );
                  } else if (currentSkills.length < 5) {
                    form.setFormValue("skills", [...currentSkills, skill]);
                  }
                }}
                disabled={
                  form.getFormValue("skills").length >= 5 &&
                  !form.getFormValue("skills").includes(skill)
                }
              />
            ))}
          </Box>
        </Box>

        {/* Submit Button */}
        <Box pa={20}>
          <ThemedButton
            type="primary"
            label="Create Gig"
            onPress={() =>
              form.validateForm((data) => createGigMutation.mutate(data))
            }
            loading={createGigMutation.isPending}
          />
        </Box>
      </Box>
    </Page>
  );
}
