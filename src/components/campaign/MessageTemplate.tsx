
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface MessageTemplateProps {
  subject: string;
  template: string;
  contactMethod: 'email' | 'instagram' | 'phone';
  onSubjectChange: (subject: string) => void;
  onTemplateChange: (template: string) => void;
}

export function MessageTemplate({
  subject,
  template,
  contactMethod,
  onSubjectChange,
  onTemplateChange
}: MessageTemplateProps) {
  return (
    <div className="space-y-3">
      {contactMethod === 'email' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <Input
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Enter message subject"
            className="w-full text-base sm:text-sm"
          />
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {contactMethod === 'phone' ? 'Call Script' : 'Message Template'}
        </label>
        <p className="text-xs text-gray-500">Use {'{name}'} for recipient name and {'{sender}'} for your name</p>
        <Textarea
          value={template}
          onChange={(e) => onTemplateChange(e.target.value)}
          placeholder={contactMethod === 'phone' ? "Enter your call script" : "Enter your message"}
          className="w-full min-h-[150px] sm:min-h-[200px] bg-white text-base sm:text-sm leading-relaxed"
        />
      </div>
    </div>
  );
}
