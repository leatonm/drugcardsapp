import { Link } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

type Scope = "EMT" | "AEMT" | "Paramedic" | "RN";
type DataType = "drug" | "question" | "bulk";

interface DrugCard {
  id: string;
  scope: string[];
  name: {
    generic: string;
    brand: string[];
  };
  class: string;
  mechanism: string;
  indications: string[];
  contraindications: string[];
  // EMT/AEMT/Paramedic fields
  adultDose?: string;
  pediatricDose?: string;
  routes?: string[];
  // RN fields
  interactions?: string[];
  education?: string[];
}

interface Question {
  id: string;
  scope: string[];
  medicationId: string;
  medication: string;
  questionType: string;
  stem: string;
  choices: string[];
  correctAnswer: string | string[];
  rationale: string;
  clinicalPearl: string;
}

export default function Imports() {
  const [activeTab, setActiveTab] = useState<DataType>("drug");
  const [scope, setScope] = useState<Scope>("Paramedic");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [jsonPreview, setJsonPreview] = useState<string>("");

  // Drug Card Form State
  const [drugForm, setDrugForm] = useState<Partial<DrugCard>>({
    id: "",
    scope: [],
    name: { generic: "", brand: [] },
    class: "",
    mechanism: "",
    indications: [],
    contraindications: [],
    adultDose: "",
    pediatricDose: "",
    routes: [],
    interactions: [],
    education: [],
  });

  // Question Form State
  const [questionForm, setQuestionForm] = useState<Partial<Question>>({
    id: "",
    scope: [],
    medicationId: "",
    medication: "",
    questionType: "multiple-choice",
    stem: "",
    choices: [],
    correctAnswer: "",
    rationale: "",
    clinicalPearl: "",
  });

  const [brandNames, setBrandNames] = useState<string>("");
  const [indications, setIndications] = useState<string>("");
  const [contraindications, setContraindications] = useState<string>("");
  const [routes, setRoutes] = useState<string>("");
  const [interactions, setInteractions] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [choices, setChoices] = useState<string>("");

  // Bulk Import State
  const [bulkJsonInput, setBulkJsonInput] = useState<string>("");
  const [bulkDataType, setBulkDataType] = useState<"drug" | "question">("question");
  const [bulkValidationResults, setBulkValidationResults] = useState<{
    valid: number;
    invalid: number;
    duplicates: number;
    fixed: number;
    errors: string[];
  } | null>(null);
  const [bulkProcessedData, setBulkProcessedData] = useState<any[]>([]);

  // GitHub Integration State
  const [githubToken, setGithubToken] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

  const updateScope = (newScope: Scope) => {
    setScope(newScope);
    if (activeTab === "drug") {
      setDrugForm((prev) => ({ ...prev, scope: [newScope] }));
    } else {
      setQuestionForm((prev) => ({ ...prev, scope: [newScope] }));
    }
  };

  const validateDrugCard = (): boolean => {
    const errors: string[] = [];

    if (!drugForm.id || drugForm.id.trim() === "") {
      errors.push("ID is required");
    }

    if (!drugForm.name?.generic || drugForm.name.generic.trim() === "") {
      errors.push("Generic name is required");
    }

    if (!drugForm.class || drugForm.class.trim() === "") {
      errors.push("Class is required");
    }

    if (!drugForm.mechanism || drugForm.mechanism.trim() === "") {
      errors.push("Mechanism is required");
    }

    if (!indications || indications.trim() === "") {
      errors.push("At least one indication is required");
    }

    if (!contraindications || contraindications.trim() === "") {
      errors.push("At least one contraindication is required");
    }

    // Validate based on scope
    if (scope === "RN") {
      if (!interactions || interactions.trim() === "") {
        errors.push("Interactions are required for RN scope");
      }
      if (!education || education.trim() === "") {
        errors.push("Education is required for RN scope");
      }
    } else {
      // EMT/AEMT/Paramedic
      if (!drugForm.adultDose || drugForm.adultDose.trim() === "") {
        errors.push("Adult dose is required");
      }
      if (!drugForm.pediatricDose || drugForm.pediatricDose.trim() === "") {
        errors.push("Pediatric dose is required");
      }
      if (!routes || routes.trim() === "") {
        errors.push("At least one route is required");
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const validateQuestion = (): boolean => {
    const errors: string[] = [];

    if (!questionForm.id || questionForm.id.trim() === "") {
      errors.push("ID is required");
    }

    if (!questionForm.medicationId || questionForm.medicationId.trim() === "") {
      errors.push("Medication ID is required");
    }

    if (!questionForm.medication || questionForm.medication.trim() === "") {
      errors.push("Medication name is required");
    }

    if (!questionForm.stem || questionForm.stem.trim() === "") {
      errors.push("Question stem is required");
    }

    if (!choices || choices.trim() === "") {
      errors.push("At least one choice is required");
    }

    if (!questionForm.correctAnswer || (typeof questionForm.correctAnswer === "string" && questionForm.correctAnswer.trim() === "")) {
      errors.push("Correct answer is required");
    }

    if (!questionForm.rationale || questionForm.rationale.trim() === "") {
      errors.push("Rationale is required");
    }

    if (!questionForm.clinicalPearl || questionForm.clinicalPearl.trim() === "") {
      errors.push("Clinical pearl is required");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const generateDrugCardJSON = (): DrugCard | null => {
    if (!validateDrugCard()) {
      return null;
    }

    const indicationsArray = indications
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    const contraindicationsArray = contraindications
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    const brandArray = brandNames
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const drugCard: DrugCard = {
      id: drugForm.id!,
      scope: [scope],
      name: {
        generic: drugForm.name!.generic,
        brand: brandArray,
      },
      class: drugForm.class!,
      mechanism: drugForm.mechanism!,
      indications: indicationsArray,
      contraindications: contraindicationsArray,
    };

    if (scope === "RN") {
      const interactionsArray = interactions
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
      const educationArray = education
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
      drugCard.interactions = interactionsArray;
      drugCard.education = educationArray;
    } else {
      drugCard.adultDose = drugForm.adultDose;
      drugCard.pediatricDose = drugForm.pediatricDose;
      const routesArray = routes
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
      drugCard.routes = routesArray;
    }

    return drugCard;
  };

  const generateQuestionJSON = (): Question | null => {
    if (!validateQuestion()) {
      return null;
    }

    const choicesArray = choices
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    // Check if correct answer is in choices
    const correctAnswerStr = typeof questionForm.correctAnswer === "string" 
      ? questionForm.correctAnswer.trim() 
      : "";

    if (!choicesArray.includes(correctAnswerStr)) {
      setValidationErrors([...validationErrors, "Correct answer must be one of the choices"]);
      return null;
    }

    const question: Question = {
      id: questionForm.id!,
      scope: [scope],
      medicationId: questionForm.medicationId!,
      medication: questionForm.medication!,
      questionType: questionForm.questionType || "multiple-choice",
      stem: questionForm.stem!,
      choices: choicesArray,
      correctAnswer: correctAnswerStr,
      rationale: questionForm.rationale!,
      clinicalPearl: questionForm.clinicalPearl!,
    };

    return question;
  };

  const handlePreview = () => {
    if (activeTab === "drug") {
      const drugCard = generateDrugCardJSON();
      if (drugCard) {
        setJsonPreview(JSON.stringify([drugCard], null, 2));
        setValidationErrors([]);
      }
    } else {
      const question = generateQuestionJSON();
      if (question) {
        setJsonPreview(JSON.stringify([question], null, 2));
        setValidationErrors([]);
      }
    }
  };

  const handleValidate = () => {
    if (activeTab === "drug") {
      validateDrugCard();
    } else {
      validateQuestion();
    }
  };

  const handleClear = () => {
    if (activeTab === "drug") {
      setDrugForm({
        id: "",
        scope: [],
        name: { generic: "", brand: [] },
        class: "",
        mechanism: "",
        indications: [],
        contraindications: [],
        adultDose: "",
        pediatricDose: "",
        routes: [],
        interactions: [],
        education: [],
      });
      setBrandNames("");
      setIndications("");
      setContraindications("");
      setRoutes("");
      setInteractions("");
      setEducation("");
    } else {
      setQuestionForm({
        id: "",
        scope: [],
        medicationId: "",
        medication: "",
        questionType: "multiple-choice",
        stem: "",
        choices: [],
        correctAnswer: "",
        rationale: "",
        clinicalPearl: "",
      });
      setChoices("");
    }
    setValidationErrors([]);
    setJsonPreview("");
  };

  const validateBulkQuestions = (items: any[]): { valid: Question[]; errors: string[] } => {
    const valid: Question[] = [];
    const errors: string[] = [];
    const seenIds = new Set<string>();

    items.forEach((item, index) => {
      const itemErrors: string[] = [];
      const itemNum = index + 1;

      // Check required fields
      if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid ID`);
      } else if (seenIds.has(item.id)) {
        itemErrors.push(`Item ${itemNum}: Duplicate ID "${item.id}"`);
      } else {
        seenIds.add(item.id);
      }

      if (!item.scope || !Array.isArray(item.scope) || item.scope.length === 0) {
        itemErrors.push(`Item ${itemNum}: Missing or invalid scope`);
      }

      if (!item.medicationId || typeof item.medicationId !== "string") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid medicationId`);
      }

      if (!item.medication || typeof item.medication !== "string") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid medication`);
      }

      if (!item.stem || typeof item.stem !== "string" || item.stem.trim() === "") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid stem`);
      }

      if (!item.choices || !Array.isArray(item.choices) || item.choices.length === 0) {
        itemErrors.push(`Item ${itemNum}: Missing or invalid choices`);
      }

      if (!item.correctAnswer) {
        itemErrors.push(`Item ${itemNum}: Missing correctAnswer`);
      } else {
        // Validate correct answer is in choices
        const correctAnswer = Array.isArray(item.correctAnswer) 
          ? item.correctAnswer 
          : [item.correctAnswer];
        
        const allInChoices = correctAnswer.every((ans: any) => 
          item.choices && item.choices.includes(ans)
        );
        
        if (!allInChoices) {
          itemErrors.push(`Item ${itemNum}: correctAnswer must be in choices array`);
        }
      }

      if (!item.rationale || typeof item.rationale !== "string") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid rationale`);
      }

      if (!item.clinicalPearl || typeof item.clinicalPearl !== "string") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid clinicalPearl`);
      }

      if (itemErrors.length === 0) {
        // Normalize the question
        const normalized: Question = {
          id: item.id.trim(),
          scope: Array.isArray(item.scope) ? item.scope.map((s: any) => String(s).trim()) : [String(item.scope).trim()],
          medicationId: item.medicationId.trim(),
          medication: item.medication.trim(),
          questionType: item.questionType || "multiple-choice",
          stem: item.stem.trim(),
          choices: item.choices.map((c: any) => String(c).trim()),
          correctAnswer: Array.isArray(item.correctAnswer) 
            ? item.correctAnswer.map((a: any) => String(a).trim())
            : String(item.correctAnswer).trim(),
          rationale: item.rationale.trim(),
          clinicalPearl: item.clinicalPearl.trim(),
        };
        valid.push(normalized);
      } else {
        errors.push(...itemErrors);
      }
    });

    return { valid, errors };
  };

  const validateBulkDrugs = (items: any[]): { valid: DrugCard[]; errors: string[] } => {
    const valid: DrugCard[] = [];
    const errors: string[] = [];
    const seenIds = new Set<string>();

    items.forEach((item, index) => {
      const itemErrors: string[] = [];
      const itemNum = index + 1;

      // Check required fields
      if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid ID`);
      } else if (seenIds.has(item.id)) {
        itemErrors.push(`Item ${itemNum}: Duplicate ID "${item.id}"`);
      } else {
        seenIds.add(item.id);
      }

      if (!item.scope || !Array.isArray(item.scope) || item.scope.length === 0) {
        itemErrors.push(`Item ${itemNum}: Missing or invalid scope`);
      }

      if (!item.name || !item.name.generic || typeof item.name.generic !== "string") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid generic name`);
      }

      if (!item.class || typeof item.class !== "string") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid class`);
      }

      if (!item.mechanism || typeof item.mechanism !== "string") {
        itemErrors.push(`Item ${itemNum}: Missing or invalid mechanism`);
      }

      if (!item.indications || !Array.isArray(item.indications) || item.indications.length === 0) {
        itemErrors.push(`Item ${itemNum}: Missing or invalid indications`);
      }

      if (!item.contraindications || !Array.isArray(item.contraindications)) {
        itemErrors.push(`Item ${itemNum}: Missing or invalid contraindications`);
      }

      // Check scope-specific fields
      const itemScope = Array.isArray(item.scope) ? item.scope[0] : item.scope;
      if (itemScope === "RN") {
        if (!item.interactions || !Array.isArray(item.interactions)) {
          itemErrors.push(`Item ${itemNum}: Missing or invalid interactions (required for RN)`);
        }
        if (!item.education || !Array.isArray(item.education)) {
          itemErrors.push(`Item ${itemNum}: Missing or invalid education (required for RN)`);
        }
      } else {
        if (!item.adultDose || typeof item.adultDose !== "string") {
          itemErrors.push(`Item ${itemNum}: Missing or invalid adultDose`);
        }
        if (!item.pediatricDose || typeof item.pediatricDose !== "string") {
          itemErrors.push(`Item ${itemNum}: Missing or invalid pediatricDose`);
        }
        if (!item.routes || !Array.isArray(item.routes) || item.routes.length === 0) {
          itemErrors.push(`Item ${itemNum}: Missing or invalid routes`);
        }
      }

      if (itemErrors.length === 0) {
        // Normalize the drug card
        const normalized: DrugCard = {
          id: item.id.trim(),
          scope: Array.isArray(item.scope) ? item.scope.map((s: any) => String(s).trim()) : [String(item.scope).trim()],
          name: {
            generic: item.name.generic.trim(),
            brand: Array.isArray(item.name.brand) 
              ? item.name.brand.map((b: any) => String(b).trim()).filter((b: string) => b.length > 0)
              : [],
          },
          class: item.class.trim(),
          mechanism: item.mechanism.trim(),
          indications: item.indications.map((i: any) => String(i).trim()),
          contraindications: item.contraindications.map((c: any) => String(c).trim()),
        };

        if (itemScope === "RN") {
          normalized.interactions = item.interactions.map((i: any) => String(i).trim());
          normalized.education = item.education.map((e: any) => String(e).trim());
        } else {
          normalized.adultDose = item.adultDose.trim();
          normalized.pediatricDose = item.pediatricDose.trim();
          normalized.routes = item.routes.map((r: any) => String(r).trim());
        }

        valid.push(normalized);
      } else {
        errors.push(...itemErrors);
      }
    });

    return { valid, errors };
  };

  const handleBulkValidate = () => {
    if (!bulkJsonInput.trim()) {
      Alert.alert("Error", "Please paste JSON data to validate");
      return;
    }

    try {
      // Try to parse JSON - handle both array and single object
      let parsed: any;
      try {
        parsed = JSON.parse(bulkJsonInput);
      } catch (e) {
        // Try wrapping in array if it's not valid JSON
        try {
          parsed = JSON.parse(`[${bulkJsonInput}]`);
        } catch (e2) {
          throw new Error("Invalid JSON format. Please check your JSON syntax.");
        }
      }

      // Ensure it's an array
      const items = Array.isArray(parsed) ? parsed : [parsed];

      let result;
      if (bulkDataType === "question") {
        result = validateBulkQuestions(items);
      } else {
        result = validateBulkDrugs(items);
      }

      const duplicates = items.length - new Set(items.map((item: any) => item.id)).size;
      const fixed = result.valid.length;
      const invalid = items.length - fixed;

      setBulkValidationResults({
        valid: fixed,
        invalid,
        duplicates,
        fixed: 0, // Will be set after deduplication
        errors: result.errors,
      });

      setBulkProcessedData(result.valid);
      setJsonPreview(JSON.stringify(result.valid, null, 2));
      setValidationErrors(result.errors);

      if (result.errors.length === 0) {
        Alert.alert(
          "Validation Success",
          `All ${items.length} item(s) are valid and ready to upload!`
        );
      } else {
        Alert.alert(
          "Validation Complete",
          `Found ${result.valid.length} valid item(s) and ${result.errors.length} error(s). Check the details below.`
        );
      }
    } catch (error: any) {
      Alert.alert("Parse Error", error.message || "Failed to parse JSON");
      setValidationErrors([error.message || "Failed to parse JSON"]);
    }
  };

  const handleBulkClear = () => {
    setBulkJsonInput("");
    setBulkValidationResults(null);
    setBulkProcessedData([]);
    setJsonPreview("");
    setValidationErrors([]);
  };

  // Determine which file to update based on scope and data type
  const getTargetFileName = (dataScope: string, dataType: "drug" | "question"): string => {
    const scopeLower = dataScope.toLowerCase();
    if (dataType === "question") {
      return `${scopeLower}Questions.json`;
    } else {
      return `${scopeLower}.json`;
    }
  };

  // Get the primary scope from data (for bulk imports with mixed scopes, use first one)
  const getPrimaryScope = (data: any[]): string => {
    if (data.length === 0) return scope;
    const firstScope = Array.isArray(data[0].scope) ? data[0].scope[0] : data[0].scope;
    return String(firstScope);
  };

  // Merge new data with existing data, avoiding duplicates by ID
  const mergeData = (existing: any[], newData: any[]): any[] => {
    const existingIds = new Set(existing.map((item: any) => item.id));
    const merged = [...existing];
    
    newData.forEach((newItem: any) => {
      if (existingIds.has(newItem.id)) {
        // Update existing item
        const index = merged.findIndex((item: any) => item.id === newItem.id);
        if (index !== -1) {
          merged[index] = newItem;
        }
      } else {
        // Add new item
        merged.push(newItem);
      }
    });
    
    return merged;
  };

  // Get file from GitHub
  const getFileFromGitHub = async (fileName: string): Promise<{ content: any[]; sha: string } | null> => {
    const repoOwner = "leatonm";
    const repoName = "drug-cards-data";
    const branch = "main";
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            ...(githubToken && { Authorization: `token ${githubToken}` }),
          },
        }
      );

      if (response.status === 404) {
        // File doesn't exist yet, return empty array
        return { content: [], sha: "" };
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const data = await response.json();
      // Decode base64 content - remove whitespace first
      const base64Content = data.content.replace(/\s/g, "");
      let content: string;
      
      if (Platform.OS === "web" && typeof atob !== "undefined") {
        content = atob(base64Content);
      } else {
        // Fallback for React Native - use TextDecoder if available
        try {
          const binaryString = global.atob?.(base64Content) || atob(base64Content);
          content = binaryString;
        } catch {
          // If atob is not available, try manual decoding
          content = decodeURIComponent(
            escape(
              typeof Buffer !== "undefined"
                ? Buffer.from(base64Content, "base64").toString("utf-8")
                : base64Content
            )
          );
        }
      }
      
      const parsed = JSON.parse(content);
      return { content: Array.isArray(parsed) ? parsed : [], sha: data.sha };
    } catch (error: any) {
      console.error("Error fetching file:", error);
      throw error;
    }
  };

  // Update file on GitHub
  const updateFileOnGitHub = async (
    fileName: string,
    content: any[],
    sha: string
  ): Promise<boolean> => {
    const repoOwner = "leatonm";
    const repoName = "drug-cards-data";
    const branch = "main";
    
    const jsonContent = JSON.stringify(content, null, 2);
    // Encode to base64
    let encodedContent: string;
    
    if (Platform.OS === "web" && typeof btoa !== "undefined") {
      encodedContent = btoa(unescape(encodeURIComponent(jsonContent)));
    } else {
      // Fallback for React Native
      try {
        encodedContent = global.btoa?.(unescape(encodeURIComponent(jsonContent))) || 
                         btoa(unescape(encodeURIComponent(jsonContent)));
      } catch {
        // If btoa is not available, try manual encoding
        if (typeof Buffer !== "undefined") {
          encodedContent = Buffer.from(jsonContent, "utf-8").toString("base64");
        } else {
          throw new Error("Base64 encoding not available in this environment");
        }
      }
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            ...(githubToken && { Authorization: `token ${githubToken}` }),
          },
          body: JSON.stringify({
            message: `Update ${fileName} with new data`,
            content: encodedContent,
            branch: branch,
            ...(sha && { sha: sha }),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update file: ${response.statusText}`);
      }

      return true;
    } catch (error: any) {
      console.error("Error updating file:", error);
      throw error;
    }
  };

  const handleUpdateGitHub = async () => {
    // Check if we have data to upload
    let dataToUpload: any[] = [];
    let dataType: "drug" | "question" = "question";
    let dataScope: string = scope;

    if (activeTab === "bulk") {
      if (bulkProcessedData.length === 0) {
        Alert.alert("Error", "No validated data to upload. Please validate your data first.");
        return;
      }
      dataToUpload = bulkProcessedData;
      dataType = bulkDataType;
      dataScope = getPrimaryScope(bulkProcessedData);
    } else if (activeTab === "drug") {
      const drugCard = generateDrugCardJSON();
      if (!drugCard) {
        Alert.alert("Error", "Please validate your drug card data first.");
        return;
      }
      dataToUpload = [drugCard];
      dataType = "drug";
      dataScope = scope;
    } else if (activeTab === "question") {
      const question = generateQuestionJSON();
      if (!question) {
        Alert.alert("Error", "Please validate your question data first.");
        return;
      }
      dataToUpload = [question];
      dataType = "question";
      dataScope = scope;
    }

    // Check for GitHub token
    if (!githubToken) {
      Alert.alert(
        "GitHub Token Required",
        "Please enter your GitHub Personal Access Token to update files.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Enter Token",
            onPress: () => setShowTokenInput(true),
          },
        ]
      );
      return;
    }

    // Determine target file
    const fileName = getTargetFileName(dataScope, dataType);
    const dataTypeLabel = dataType === "drug" ? "drug card(s)" : "question(s)";

    // Show confirmation dialog
    Alert.alert(
      "Confirm GitHub Update",
      `Are you sure you want to update ${fileName}?\n\n` +
      `• ${dataToUpload.length} ${dataTypeLabel} will be added/updated\n` +
      `• Existing data will be preserved\n` +
      `• Items with matching IDs will be updated\n\n` +
      `This action will modify the file on GitHub.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update GitHub",
          style: "default",
          onPress: () => performGitHubUpdate(fileName, dataToUpload),
        },
      ]
    );
  };

  const performGitHubUpdate = async (fileName: string, dataToUpload: any[]) => {
    setIsUpdating(true);

    try {
      // Get existing file
      const existingFile = await getFileFromGitHub(fileName);
      
      if (!existingFile) {
        throw new Error("Failed to fetch existing file");
      }

      // Merge data
      const mergedData = mergeData(existingFile.content, dataToUpload);
      
      // Update file
      const success = await updateFileOnGitHub(
        fileName,
        mergedData,
        existingFile.sha
      );

      if (success) {
        const newItems = dataToUpload.filter(
          (item) => !existingFile.content.some((existing: any) => existing.id === item.id)
        ).length;
        const updatedItems = dataToUpload.length - newItems;
        
        Alert.alert(
          "Success",
          `Successfully updated ${fileName}!\n\n` +
          `• New items: ${newItems}\n` +
          `• Updated items: ${updatedItems}\n` +
          `• Total items in file: ${mergedData.length}`,
          [
            {
              text: "OK",
              onPress: () => {
                // Clear forms after successful update
                if (activeTab === "bulk") {
                  handleBulkClear();
                } else {
                  handleClear();
                }
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("GitHub update error:", error);
      Alert.alert(
        "Update Failed",
        error.message || "Failed to update GitHub. Please check your token and try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={styles.backLink}>← Back to Home</Text>
              </TouchableOpacity>
            </Link>
            <Text style={styles.title}>To make Lauren's life easier</Text>
            <Text style={styles.subtitle}>
              Validate and update drug cards and critical thinking questions
            </Text>
            
            {/* GitHub Token Input */}
            <View style={styles.tokenContainer}>
              <Text style={styles.label}>GitHub Token:</Text>
              <TextInput
                style={styles.input}
                value={githubToken}
                onChangeText={setGithubToken}
                placeholder="Enter your GitHub Personal Access Token"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
              />
              <Text style={styles.tokenHelp}>
                Required for updating files. Create a token at github.com/settings/tokens with "repo" permissions.
              </Text>
            </View>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "drug" && styles.tabActive]}
              onPress={() => setActiveTab("drug")}
            >
              <Text style={[styles.tabText, activeTab === "drug" && styles.tabTextActive]}>
                Drug Cards
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "question" && styles.tabActive]}
              onPress={() => setActiveTab("question")}
            >
              <Text style={[styles.tabText, activeTab === "question" && styles.tabTextActive]}>
                Questions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "bulk" && styles.tabActive]}
              onPress={() => setActiveTab("bulk")}
            >
              <Text style={[styles.tabText, activeTab === "bulk" && styles.tabTextActive]}>
                Bulk Import
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scope Selector - Hidden for bulk import */}
          {activeTab !== "bulk" && (
            <View style={styles.scopeContainer}>
              <Text style={styles.label}>Scope:</Text>
              <View style={styles.scopeButtons}>
                {(["EMT", "AEMT", "Paramedic", "RN"] as Scope[]).map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.scopeButton, scope === s && styles.scopeButtonActive]}
                    onPress={() => updateScope(s)}
                  >
                    <Text style={[styles.scopeButtonText, scope === s && styles.scopeButtonTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Drug Card Form */}
          {activeTab === "drug" && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Drug Card Information</Text>

              <Text style={styles.label}>ID *</Text>
              <TextInput
                style={styles.input}
                value={drugForm.id}
                onChangeText={(text) => setDrugForm({ ...drugForm, id: text })}
                placeholder={`e.g., ${scope.toLowerCase()}-001`}
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Generic Name *</Text>
              <TextInput
                style={styles.input}
                value={drugForm.name?.generic}
                onChangeText={(text) =>
                  setDrugForm({ ...drugForm, name: { ...drugForm.name!, generic: text } })
                }
                placeholder="e.g., Epinephrine"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Brand Names (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={brandNames}
                onChangeText={setBrandNames}
                placeholder="e.g., Adrenalin, EpiPen"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Class *</Text>
              <TextInput
                style={styles.input}
                value={drugForm.class}
                onChangeText={(text) => setDrugForm({ ...drugForm, class: text })}
                placeholder="e.g., Sympathomimetic"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Mechanism *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={drugForm.mechanism}
                onChangeText={(text) => setDrugForm({ ...drugForm, mechanism: text })}
                placeholder="Describe the mechanism of action"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Indications (comma-separated) *</Text>
              <TextInput
                style={styles.input}
                value={indications}
                onChangeText={setIndications}
                placeholder="e.g., Anaphylaxis, Severe asthma, Cardiac arrest"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Contraindications (comma-separated) *</Text>
              <TextInput
                style={styles.input}
                value={contraindications}
                onChangeText={setContraindications}
                placeholder="e.g., None in emergencies, Hypersensitivity"
                placeholderTextColor={colors.textMuted}
              />

              {scope === "RN" ? (
                <>
                  <Text style={styles.label}>Interactions (comma-separated) *</Text>
                  <TextInput
                    style={styles.input}
                    value={interactions}
                    onChangeText={setInteractions}
                    placeholder="e.g., Digoxin (toxicity), Beta-adrenergic blockers"
                    placeholderTextColor={colors.textMuted}
                  />

                  <Text style={styles.label}>Education (comma-separated) *</Text>
                  <TextInput
                    style={styles.input}
                    value={education}
                    onChangeText={setEducation}
                    placeholder="e.g., Report signs of infection, Change positions slowly"
                    placeholderTextColor={colors.textMuted}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.label}>Adult Dose *</Text>
                  <TextInput
                    style={styles.input}
                    value={drugForm.adultDose}
                    onChangeText={(text) => setDrugForm({ ...drugForm, adultDose: text })}
                    placeholder="e.g., 0.3 mg IM (1:1000)"
                    placeholderTextColor={colors.textMuted}
                  />

                  <Text style={styles.label}>Pediatric Dose *</Text>
                  <TextInput
                    style={styles.input}
                    value={drugForm.pediatricDose}
                    onChangeText={(text) => setDrugForm({ ...drugForm, pediatricDose: text })}
                    placeholder="e.g., 0.01 mg/kg IM/IV"
                    placeholderTextColor={colors.textMuted}
                  />

                  <Text style={styles.label}>Routes (comma-separated) *</Text>
                  <TextInput
                    style={styles.input}
                    value={routes}
                    onChangeText={setRoutes}
                    placeholder="e.g., IM, IV, IO, SQ"
                    placeholderTextColor={colors.textMuted}
                  />
                </>
              )}
            </View>
          )}

          {/* Question Form */}
          {activeTab === "question" && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Critical Thinking Question</Text>

              <Text style={styles.label}>ID *</Text>
              <TextInput
                style={styles.input}
                value={questionForm.id}
                onChangeText={(text) => setQuestionForm({ ...questionForm, id: text })}
                placeholder={`e.g., ${scope.toLowerCase().substring(0, 4)}-q-001`}
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Medication ID *</Text>
              <TextInput
                style={styles.input}
                value={questionForm.medicationId}
                onChangeText={(text) => setQuestionForm({ ...questionForm, medicationId: text })}
                placeholder="e.g., paramedic-201"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Medication Name *</Text>
              <TextInput
                style={styles.input}
                value={questionForm.medication}
                onChangeText={(text) => setQuestionForm({ ...questionForm, medication: text })}
                placeholder="e.g., Enalapril / Enalaprilat (Vasotec)"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Question Stem *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={questionForm.stem}
                onChangeText={(text) => setQuestionForm({ ...questionForm, stem: text })}
                placeholder="Enter the question text"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Choices (one per line) *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={choices}
                onChangeText={setChoices}
                placeholder="Enter each choice on a new line"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Correct Answer *</Text>
              <TextInput
                style={styles.input}
                value={typeof questionForm.correctAnswer === "string" ? questionForm.correctAnswer : ""}
                onChangeText={(text) => setQuestionForm({ ...questionForm, correctAnswer: text })}
                placeholder="Must match one of the choices exactly"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Rationale *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={questionForm.rationale}
                onChangeText={(text) => setQuestionForm({ ...questionForm, rationale: text })}
                placeholder="Explain why this answer is correct"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Clinical Pearl *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={questionForm.clinicalPearl}
                onChangeText={(text) => setQuestionForm({ ...questionForm, clinicalPearl: text })}
                placeholder="Provide a clinical insight or tip"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={2}
              />
            </View>
          )}

          {/* Bulk Import Form */}
          {activeTab === "bulk" && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Bulk Import</Text>
              <Text style={styles.description}>
                Paste JSON data from ChatGPT or other sources. The tool will validate, fix formatting, 
                check for duplicate IDs, and prepare the data for upload.
              </Text>

              <View style={styles.bulkTypeSelector}>
                <Text style={styles.label}>Data Type:</Text>
                <View style={styles.scopeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.scopeButton,
                      bulkDataType === "question" && styles.scopeButtonActive,
                    ]}
                    onPress={() => setBulkDataType("question")}
                  >
                    <Text
                      style={[
                        styles.scopeButtonText,
                        bulkDataType === "question" && styles.scopeButtonTextActive,
                      ]}
                    >
                      Questions
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.scopeButton,
                      bulkDataType === "drug" && styles.scopeButtonActive,
                    ]}
                    onPress={() => setBulkDataType("drug")}
                  >
                    <Text
                      style={[
                        styles.scopeButtonText,
                        bulkDataType === "drug" && styles.scopeButtonTextActive,
                      ]}
                    >
                      Drug Cards
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.label}>Paste JSON Data *</Text>
              <TextInput
                style={[styles.input, styles.bulkTextArea]}
                value={bulkJsonInput}
                onChangeText={setBulkJsonInput}
                placeholder='Paste your JSON here, e.g., [{ "id": "para-q-201", "scope": ["Paramedic"], ... }]'
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={15}
              />

              {/* Validation Results */}
              {bulkValidationResults && (
                <View style={styles.validationResults}>
                  <Text style={styles.sectionTitle}>Validation Results</Text>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Valid Items:</Text>
                    <Text style={[styles.resultValue, styles.resultSuccess]}>
                      {bulkValidationResults.valid}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Invalid Items:</Text>
                    <Text style={[styles.resultValue, styles.resultError]}>
                      {bulkValidationResults.invalid}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Duplicate IDs Found:</Text>
                    <Text style={[styles.resultValue, styles.resultWarning]}>
                      {bulkValidationResults.duplicates}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Validation Errors:</Text>
              {validationErrors.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  • {error}
                </Text>
              ))}
            </View>
          )}

          {/* JSON Preview */}
          {jsonPreview && (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionTitle}>JSON Preview</Text>
              <ScrollView style={styles.jsonPreview}>
                <Text style={styles.jsonText}>{jsonPreview}</Text>
              </ScrollView>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {activeTab === "bulk" ? (
              <>
                <TouchableOpacity style={styles.button} onPress={handleBulkValidate}>
                  <Text style={styles.buttonText}>Validate & Fix</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={handleBulkClear}>
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
                {jsonPreview && bulkProcessedData.length > 0 && (
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSuccess, isUpdating && styles.buttonDisabled]}
                    onPress={handleUpdateGitHub}
                    disabled={isUpdating}
                  >
                    <Text style={styles.buttonText}>
                      {isUpdating ? "Updating..." : "Update GitHub"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={handleValidate}>
                  <Text style={styles.buttonText}>Validate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handlePreview}>
                  <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Preview JSON</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={handleClear}>
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
                {jsonPreview && (
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSuccess, isUpdating && styles.buttonDisabled]}
                    onPress={handleUpdateGitHub}
                    disabled={isUpdating}
                  >
                    <Text style={styles.buttonText}>
                      {isUpdating ? "Updating..." : "Update GitHub"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Mediccards. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: spacing.xl,
  },
  backLink: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: "500",
  },
  tabTextActive: {
    color: colors.buttonText,
    fontWeight: "600",
  },
  scopeContainer: {
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 8,
  },
  scopeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  scopeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  scopeButtonActive: {
    backgroundColor: colors.primary,
  },
  scopeButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  scopeButtonTextActive: {
    color: colors.buttonText,
  },
  formContainer: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: 8,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 6,
    padding: spacing.md,
    fontSize: 16,
    color: colors.primary,
    backgroundColor: colors.background,
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    ...(Platform.OS === "web" && { height: 100 }),
  },
  errorContainer: {
    backgroundColor: "#FEE",
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  previewContainer: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: 8,
    marginBottom: spacing.xl,
  },
  jsonPreview: {
    backgroundColor: "#1E1E1E",
    borderRadius: 6,
    padding: spacing.lg,
    maxHeight: 400,
  },
  jsonText: {
    fontFamily: Platform.OS === "web" ? "monospace" : "monospace",
    fontSize: 12,
    color: "#D4D4D4",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 100,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.xl * 2,
    paddingTop: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  bulkTypeSelector: {
    marginBottom: spacing.lg,
  },
  bulkTextArea: {
    minHeight: 300,
    fontFamily: Platform.OS === "web" ? "monospace" : "monospace",
    fontSize: 14,
    ...(Platform.OS === "web" && { height: 300 }),
  },
  validationResults: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  resultLabel: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  resultSuccess: {
    color: colors.success,
  },
  resultError: {
    color: colors.danger,
  },
  resultWarning: {
    color: "#FFA500",
  },
  tokenContainer: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  tokenHelp: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

