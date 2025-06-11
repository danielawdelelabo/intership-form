import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SignaturePad from "react-signature-canvas";
import { createApplication } from "./services/database";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

function App() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dateOfBirth: "",
    residenceAddress: "",
    dateOfAgreement: "",
    acceptTerms: false,
  });

  const [signatureImageUrl, setSignatureImageUrl] = useState("");
  const [idDocumentUrl, setIdDocumentUrl] = useState("");
  const [penColor, setPenColor] = useState("black");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sigPadRef = useRef<SignaturePad>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setError(null);
  };

  // Dedicated handler for Checkbox
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = ""; // Clear the input
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => setIsSubmitting(true);
    reader.onloadend = () => {
      setIdDocumentUrl(reader.result as string);
      setIsSubmitting(false);
      setError(null);
    };
    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      setIsSubmitting(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signatureImageUrl) {
      setError("Please provide your signature.");
      return;
    }

    if (!idDocumentUrl) {
      setError("Please upload your ID document.");
      return;
    }

    setIsSubmitting(true);
    try {
      const application = await createApplication({
        email: formData.email,
        fullName: formData.fullName,
        dateOfBirth: new Date(formData.dateOfBirth),
        residenceAddress: formData.residenceAddress,
        dateOfAgreement: new Date(formData.dateOfAgreement),
        signatureImageUrl: signatureImageUrl,
        idDocumentUrl: idDocumentUrl,
        termsAccepted: formData.acceptTerms,
      });

      console.log("Application submitted successfully:", application);
      alert("Your application has been submitted successfully!");

      // Reset form
      setFormData({
        email: "",
        fullName: "",
        dateOfBirth: "",
        residenceAddress: "",
        dateOfAgreement: "",
        acceptTerms: false,
      });
      setSignatureImageUrl("");
      setIdDocumentUrl("");
      if (sigPadRef.current) {
        sigPadRef.current.clear();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setError(
        "There was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
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
        </div>

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
            required
          />
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
        </div>

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
            required
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
              I acknowledge that your company's activities involve providing
              computer services of all kinds, particularly those related to
              consulting services, electronic data analysis, software
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
              your company's management and internal regulations.
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

        <div className="space-y-2">
          <Label className="block text-lg font-semibold">
            Your Signature <span className="text-red-500">*</span>
          </Label>
          <p className="text-gray-400 mb-2">Add your signature here</p>
          <div className="mb-2">Signature</div>
          <div className="flex items-center space-x-4 mb-2">
            {[
              { color: "black", label: "Black" },
              { color: "blue", label: "Blue" },
              { color: "red", label: "Red" },
              { color: "green", label: "Green" },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  penColor === c.color ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: c.color }}
                aria-label={c.label}
                onClick={() => setPenColor(c.color)}
              >
                {penColor === c.color && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
          <div
            className="relative bg-white rounded-lg border"
            style={{ minHeight: 180 }}
          >
            <SignaturePad
              ref={sigPadRef}
              penColor={penColor}
              canvasProps={{
                width: 800,
                height: 180,
                className:
                  "rounded-lg w-full h-44 bg-white border-none outline-none",
              }}
              onEnd={() => {
                if (sigPadRef.current) {
                  setSignatureImageUrl(
                    sigPadRef.current.getTrimmedCanvas().toDataURL("image/png")
                  );
                }
              }}
            />
            <button
              type="button"
              className="absolute right-4 bottom-2 text-yellow-400 font-bold text-lg hover:underline"
              onClick={() => {
                sigPadRef.current?.clear();
                setSignatureImageUrl("");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="idDocument" className="block text-lg font-semibold">
            ID Document <span className="text-red-500">*</span>
          </Label>
          <p className="text-gray-400 mb-2">
            Upload a copy of your ID document (JPEG, PNG, or PDF, max 5MB)
          </p>
          <Input
            type="file"
            id="idDocument"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileUpload}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={handleCheckboxChange}
            disabled={isSubmitting}
            required
          />
          <Label htmlFor="acceptTerms" className="text-sm">
            I accept the terms and conditions *
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full py-3 px-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}

export default App;
