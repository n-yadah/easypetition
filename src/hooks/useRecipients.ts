
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Recipient } from "@/types/campaign";

export function useRecipients() {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipients = async () => {
      setIsLoading(true);
      console.log('useRecipients: Fetching recipients from Supabase...');
      
      try {
        const { data, error } = await supabase
          .from('recipients')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data && Array.isArray(data)) {
          console.log('useRecipients: Successfully fetched', data.length, 'recipients');
          
          // Note: We'll let the RecipientCard component handle specific image URLs
          // to avoid any confusion in the data flow
          setRecipients(data);
        } else {
          console.warn('useRecipients: No data returned or invalid format');
          setRecipients([]);
        }
      } catch (error: any) {
        console.error('useRecipients: Error fetching recipients:', error);
        toast({
          title: "Error loading recipients",
          description: error.message || "Could not load recipients",
          variant: "destructive",
        });
        setRecipients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipients();
  }, [toast]);

  return recipients;
}
