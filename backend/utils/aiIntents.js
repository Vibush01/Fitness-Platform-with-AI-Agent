const aiIntents = {
    diet: {
      keywords: ['diet', 'nutrition', 'food', 'macros', 'calories', 'protein', 'carbs', 'fats'],
      response: (member, macroLogs) => {
        const recentMacros = macroLogs[0]?.macros || { calories: 0, protein: 0, carbs: 0, fats: 0 };
        const proteinTarget = member.weight ? (member.weight * 1.8).toFixed(1) : 'unknown';
        return `Hi ${member.name}! Based on your recent macro logs (Calories: ${recentMacros.calories}, Protein: ${recentMacros.protein}g, Carbs: ${recentMacros.carbs}g, Fats: ${recentMacros.fats}g), I suggest aiming for ${proteinTarget}g of protein daily (1.6-2.2g per kg of body weight). Consider adding foods like chicken, eggs, or lentils.`;
      },
    },
    workout: {
      keywords: ['workout', 'exercise', 'training', 'plan', 'routine', 'gym'],
      response: (member, bodyProgress) => {
        const latestProgress = bodyProgress[0] || { weight: 0, muscleMass: 0, fatPercentage: 0 };
        return `Hi ${member.name}! Considering your latest body progress (Weight: ${latestProgress.weight}kg, Muscle Mass: ${latestProgress.muscleMass}kg, Fat: ${latestProgress.fatPercentage}%), I recommend a balanced workout plan: 3 days of strength training (focus on compound lifts like squats and deadlifts) and 2 days of cardio (30 mins each).`;
      },
    },
    general: {
      keywords: ['hi', 'hello', 'help', 'fitness', 'advice'],
      response: (member) => {
        return `Hi ${member.name}! I'm Vibush, your fitness assistant at BeFit. I can help with diet plans, workout routines, or general fitness advice. What would you like to know?`;
      },
    },
    default: {
      response: (member) => {
        return `Hi ${member.name}! I'm not sure I understood your query. I can help with diet, workouts, or fitness advice. What would you like to talk about?`;
      },
    },
  };
  
  const matchIntent = (query) => {
    const lowerQuery = query.toLowerCase();
    for (const [intent, data] of Object.entries(aiIntents)) {
      if (intent === 'default') continue;
      if (data.keywords && data.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return intent;
      }
    }
    return 'default';
  };
  
  module.exports = { aiIntents, matchIntent };