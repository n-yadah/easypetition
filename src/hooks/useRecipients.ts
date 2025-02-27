
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
        console.log('Recipients data:', data);
        setRecipients(data);
      }
    };

    fetchRecipients();
  }, [toast]);

  return recipients;
}
