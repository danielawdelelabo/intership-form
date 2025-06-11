import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function App() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dateOfBirth: "",
    residenceAddress: "",
    dateOfAgreement: "",
    acceptTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Dedicated handler for Checkbox
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={handleCheckboxChange}
            required
          />
          <Label htmlFor="acceptTerms" className="text-sm">
            I accept the terms and conditions *
          </Label>
        </div>

        <Button type="submit" className="w-full py-3 px-4">
          Submit Application
        </Button>
      </form>
    </div>
  );
}

export default App;
