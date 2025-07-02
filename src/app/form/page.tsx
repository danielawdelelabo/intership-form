"use client";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
} from "../../../components/ui";
import SignaturePad from "react-signature-canvas";
import { uploadFile } from "../utils/uploadFile";

const Page = () => {
  const sigPadRef = useRef<SignaturePad>(null);
  const [penColor, setPenColor] = useState("black");
  const today = format(new Date(), "yyyy-MM-dd");
  const eighteenYearsAgo = format(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "yyyy-MM-dd");
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dateOfBirth: "",
    residenceAddress: "",
    dateOfAgreement: today,
    acceptTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);

  // Check if user has already submitted and redirect
  React.useEffect(() => {
    const existingSubmission = localStorage.getItem("internshipSubmission");
    if (existingSubmission) {
      // User has already submitted, redirect to success page
      window.location.href = "/success";
    }
  }, []);

  // Age validation function
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validateAge = (dateOfBirth: string): string | null => {
    if (!dateOfBirth) return null;

    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      return "You must be at least 18 years old to apply.";
    }

    if (age > 40) {
      return "You must be 40 years old or younger to apply.";
    }

    return null;
  };

  // Update handleChange to handle checkboxes and add file validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Validate age for date of birth field
    if (name === "dateOfBirth") {
      const ageError = validateAge(value);
      setError(ageError);
    } else {
      setError(null);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
    setError(null);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please upload a valid file type (JPEG, PNG, or PDF)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  // Modify handleFileUpload to use state directly without async validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    // Store file temporarily - no async operations in this event handler
    setIdDocumentFile(file);
    setError(null);
    // console.log("Document file stored temporarily:", file.name);
  };

  // Email checking function
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error("Error response from email check:", response.status);
        return false;
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const SignatureSection = () => (
    <div className="space-y-4">
      <div>
        <Label className="block text-lg font-semibold text-gray-800">
          Digital Signature <span className="text-red-500">*</span>
        </Label>
        <p className="text-gray-600 text-sm mt-1">
          Please sign below using your mouse, trackpad, or finger on touch
          devices
        </p>
      </div>

      {/* Pen color selection */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">Pen Color:</span>
        <div className="flex space-x-2">
          {[
            { color: "black", label: "Black" },
            { color: "#1e40af", label: "Blue" },
            { color: "#dc2626", label: "Red" },
            { color: "#059669", label: "Green" },
          ].map((c) => (
            <button
              key={c.color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                penColor === c.color
                  ? "border-gray-800 shadow-md ring-2 ring-gray-300"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: c.color }}
              aria-label={c.label}
              onClick={() => setPenColor(c.color)}
            >
              {penColor === c.color && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Signature canvas area */}
      <div className="relative">
        <div
          className={`relative bg-white rounded-lg border-2 transition-colors ${
            signatureBlob
              ? "border-green-300 bg-green-50/20"
              : "border-solid border-gray-500 hover:border-gray-400"
          }`}
          style={{ minHeight: 200 }}
        >
          <SignaturePad
            ref={sigPadRef}
            penColor={penColor}
            canvasProps={{
              width: 800,
              height: 200,
              className: "rounded-lg w-full bg-transparent",
            }}
            onEnd={() => {
              // This fires when user finishes drawing
              if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
                const dataURL = sigPadRef.current.toDataURL("image/png");
                fetch(dataURL)
                  .then((res) => res.blob())
                  .then((blob) => {
                    setSignatureBlob(blob);
                    // console.log('Signature captured successfully');
                  });
              }
            }}
          />

          {/* Placeholder text when no signature */}
          {!signatureBlob && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-1">✍️</div>
                <p className="text-gray-400 text-sm">
                  Click and drag to sign here
                </p>
              </div>
            </div>
          )}

          {/* Clear button */}
          <div className="absolute top-3 right-3">
            <button
              type="button"
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm"
              onClick={() => {
                sigPadRef.current?.clear();
                setSignatureBlob(null);
                // console.log('Signature cleared');
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Success message */}
      {signatureBlob && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <span className="text-green-700 text-sm font-medium">
            Signature captured successfully
          </span>
        </div>
      )}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">Tips for a good signature:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Sign as you normally would on official documents</li>
          <li>Make sure your signature is clear and complete</li>
          <li>Use the color that provides the best contrast and visibility</li>
        </ul>
      </div>
    </div>
  );
  // Update handleSubmit to ensure all async operations complete properly
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate age before submission
    const ageError = validateAge(formData.dateOfBirth);
    if (ageError) {
      setError(ageError);
      toast.error(ageError);
      return;
    }

    // console.log('Checking if email exists:', formData.email);
    setIsCheckingEmail(true);
    toast.info("Checking email availability...");

    try {
      const emailExists = await checkEmailExists(formData.email);
      setIsCheckingEmail(false);

      if (emailExists) {
        toast.error(
          "This email has already been used for an application. Please use a different email."
        );
        setError(
          "This email has already been used for an application. Please use a different email."
        );
        return;
      }
      toast.success("Email is available! Continuing with form submission...");
    } catch (error) {
      setIsCheckingEmail(false);
      console.error("Email check failed:", error);
      // Continue with submission if email check fails
      // toast.warning("Could not verify email availability, proceeding with submission...");
    }

    if (!signatureBlob && (!sigPadRef.current || sigPadRef.current.isEmpty())) {
      // No signature captured, show error
      toast.error(
        "Please provide your signature by drawing in the signature area."
      );
      setError(
        "Please provide your signature by drawing in the signature area"
      );
      return;
    }

    // Convert signature pad to proper image file
    let signatureFile: File | null = null;
    try {
      let dataURL: string;

      // Use existing signatureBlob if available, otherwise get from signature pad
      if (signatureBlob) {
        // Convert blob to dataURL
        const reader = new FileReader();
        dataURL = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(signatureBlob);
        });
      } else if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
        dataURL = sigPadRef.current.toDataURL("image/png");
      } else {
        toast.error(
          "Please provide your signature by drawing in the signature area."
        );
        // setError(
        //   "Please provide your signature by drawing in the signature area."
        // );
        return;
      }
      function dataURLtoFile(dataurl: string, filename: string): File {
        const arr = dataurl.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/png";
        const bstr = atob(arr[1]);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        return new File([u8arr], filename, { type: mime });
      }
      signatureFile = dataURLtoFile(dataURL, `signature.png`);
    } catch (error) {
      console.error("Error converting signature:", error);
      toast.error(
        "Error processing signature. Please try drawing your signature again."
      );
      // setError(
      //   "Error processing signature. Please try drawing your signature again."
      // );
      return;
    }

    if (!signatureFile || signatureFile.size < 100) {
      toast.error(
        "Signature is too small or invalid. Please draw a clearer signature."
      );
      // setError(
      //   "Signature is too small or invalid. Please draw a clearer signature."
      // );
      return;
    }
    if (!idDocumentFile) {
      toast.error("Please upload your ID document.");
      // setError("Please upload your ID document.");
      return;
    }

    if (!formData.acceptTerms) {
      toast.warn("You must accept the terms and conditions.");
      // setError("You must accept the terms and conditions.");
      return;
    } // Start the submission process
    setIsSubmitting(true);
    try {
      const sessionTimestamp = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Upload signature as proper PNG file
      // toast.info("Uploading signature...");
      const signatureUrl = await uploadFile(
        signatureFile,
        formData.fullName,
        "signatures",
        2,
        sessionTimestamp
      );
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Upload document to Firebase
      // toast.info("Uploading ID document...");
      const documentUrl = await uploadFile(
        idDocumentFile,
        formData.fullName,
        "documents",
        2,
        sessionTimestamp
      );

      // Submit form with uploaded file URLs
      toast.info("Submitting application...");
      const response = await fetch(
        "/api/internship-services/createInternship",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
            dateOfBirth: new Date(formData.dateOfBirth),
            residenceAddress: formData.residenceAddress,
            dateOfAgreement: new Date(formData.dateOfAgreement),
            signatureImageUrl: signatureUrl,
            idDocumentUrl: documentUrl,
            termsAccepted: formData.acceptTerms,
          }),
        }
      );

      // console.log("Response status:", response.status);

      if (!response.ok) {
        toast.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }      const result = await response.json();
      // console.log("Server response:", result);

      if (result.success) {
        toast.success("Your application has been submitted successfully!");

        // Save submission data to localStorage
        const submissionData = {
          email: formData.email,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          residenceAddress: formData.residenceAddress,
          dateOfAgreement: formData.dateOfAgreement,
          submissionTimestamp: Date.now(),
        };
        localStorage.setItem("internshipSubmission", JSON.stringify(submissionData));

        // Reset form
        setFormData({
          email: "",
          fullName: "",
          dateOfBirth: "",
          residenceAddress: "",
          dateOfAgreement: today,
          acceptTerms: false,
        });
        setSignatureBlob(null);
        setIdDocumentFile(null);
        if (sigPadRef.current) {
          sigPadRef.current.clear();
        }

        // Redirect to success page after a short delay
        setTimeout(() => {
          window.location.href = "/success";
        }, 2000);
      } else {
        toast.error(
          result.error ||
            "There was an error submitting your application. Please try again."
        );
        setError(
          result.error ||
            "There was an error submitting your application. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to submit application"
        }`
      );
      console.error("Error submitting application:", error);
      setError(
        `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to submit application"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Internship Application Form
        </h1>
        <div className="space-y-2">
          <Label htmlFor="email" className="block">
            Email *
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName" className="block">
            Full Name *
          </Label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="block">
            Date of Birth *
          </Label>
          <Input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={eighteenYearsAgo}
            required
          />
          <p className="text-sm text-gray-500">
            You must be at least 18 years old to apply.
          </p>
          {error && formData.dateOfBirth && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="residenceAddress" className="block">
            Residence Address *
          </Label>
          <Textarea
            id="residenceAddress"
            name="residenceAddress"
            value={formData.residenceAddress}
            onChange={handleChange}
            required
            className="min-h-[100px] resize-y"
          />
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="dateOfAgreement" className="block">
            Date of Agreement *
          </Label>
          <Input
            type="date"
            id="dateOfAgreement"
            name="dateOfAgreement"
            value={formData.dateOfAgreement}
            onChange={handleChange}
            disabled
            required
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Non-Disclosure Agreement
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>To the respected LeLaboDigital SARL,</p>
            <p>
              I, the undersigned, being the person completing this form, hereby
              declare and undertake the following of my own free will:
            </p>
            <p>
              I acknowledge that your company&apos;s activities involve
              providing computer services of all kinds, particularly those
              related to consulting services, electronic data analysis, software
              development, and technology consulting. Therefore, all information
              that I will access of any kind is extremely confidential and
              subject to professional confidentiality.
            </p>
            <p>
              I acknowledge that any methodologies, techniques, or skills -
              whether managerial, informational, financial, or human - adopted
              by your company are its exclusive property, meaning intellectual
              and moral property.
            </p>
            <p>
              I declare that I am not directly or indirectly involved in any
              capacity with any company operating in a similar or competing
              field.
            </p>
            <p>
              I undertake to complete my tasks professionally and honestly and
              to fully comply with the guidelines and instructions issued by
              your company&apos;s management and internal regulations.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Internship Terms
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-700">
                Employment Guarantee
              </h3>
              <p>
                It is important to note that the internship does not guarantee
                subsequent employment at LeLaboDigital. However, it opens
                avenues for potential collaboration on future projects.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Compensation</h3>
              <p>The internship is unpaid.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Office Hours</h3>
              <p>
                Our standard office hours are from Monday to Friday, 9:00 am to
                6:00 pm.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Hybrid Work Model</h3>
              <p>
                We acknowledge the evolving nature of work preferences. While we
                offer a hybrid work environment, your physical presence at the
                office on days selected by your supervisor is required.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">
                Supervisor Availability
              </h3>
              <p>
                The supervisor will be available for scheduled meetings on
                Wednesdays from 10:00 AM to 12:00 PM.
              </p>
            </div>
          </div>
        </div>
        <SignatureSection />{" "}
        <div className="space-y-2">
          <Label htmlFor="idDocument" className="block text-lg font-semibold">
            ID Document <span className="text-red-500">*</span>
          </Label>
          <p className="text-gray-400 mb-2">
            Upload a copy of your ID document or passport (JPEG, PNG, or PDF,
            max 5MB)
          </p>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              id="idDocument"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              disabled={false}
              required
              className="flex-1"
            />
            {idDocumentFile && (
              <Button
                type="button"
                onClick={() => {
                  setIdDocumentFile(null);
                  const fileInput = document.getElementById(
                    "idDocument"
                  ) as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = "";
                  }
                  setError(null);
                }}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
              >
                Delete
              </Button>
            )}
          </div>
          {idDocumentFile && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-green-700 text-sm font-medium">
                File uploaded: {idDocumentFile.name}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={handleCheckboxChange}
            disabled={false}
            required
          />
          <Label htmlFor="acceptTerms" className="text-sm">
            I accept the terms and conditions *
          </Label>
        </div>
        <Button
          type="submit"
          className="w-full py-3 px-4"
          disabled={isSubmitting || isCheckingEmail}
        >
          {isCheckingEmail
            ? "Checking email..."
            : isSubmitting
            ? "Submitting..."
            : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
