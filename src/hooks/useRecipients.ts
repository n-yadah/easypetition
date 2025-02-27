
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Recipient } from "@/types/campaign";

export function useRecipients() {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    const fetchRecipients = async () => {
      console.log('Fetching recipients...');
      
      const { data, error } = await supabase
        .from('recipients')
        .select('*');
      
      if (error) {
        console.error('Error fetching recipients:', error);
        toast({
          title: "Error loading recipients",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log('Original data:', data);
        
        // Create new array with updated photo URLs
        const updatedData = data.map(recipient => {
          console.log('Processing recipient:', recipient.name);
          
          if (recipient.name === 'Sara Jacobs') {
            console.log('Updating Sara Jacobs photo URL');
            return {
              ...recipient,
              photo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Representative_Sara_Jacobs_full_portrait.jpg'
            };
          }
          if (recipient.name === 'Ted Cruz') {
            return {
              ...recipient,
              photo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Ted_Cruz_senatorial_portrait.jpg'
            };
          }
          return recipient;
        });
        
        console.log('Updated data:', updatedData);
        setRecipients(updatedData);
      }
    };

    fetchRecipients();
  }, [toast]);

  return recipients;
}
